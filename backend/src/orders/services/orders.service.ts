import { 
  Injectable, NotFoundException, BadRequestException, ForbiddenException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { 
  Order, OrderLog, Refund, OrderStatus, OrderType, PaymentMethod 
} from '../../entities/order.entity';
import { Agent, PricingModel } from '../../entities/agent.entity';
import { User } from '../../entities/user.entity';
import {
  CreateOrderDto, CreateRechargeOrderDto, PayOrderDto, QueryOrdersDto,
  OrderResponseDto, OrderListResponseDto, OrderDetailResponseDto,
  CreateRefundDto, RefundResponseDto, ProcessRefundDto,
  OrderStatsDto, ExportOrdersDto, CancelOrderDto, PaymentCallbackDto
} from '../dto/order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderLog)
    private readonly orderLogRepository: Repository<OrderLog>,
    @InjectRepository(Refund)
    private readonly refundRepository: Repository<Refund>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 创建订单
   */
  async create(userId: string, dto: CreateOrderDto): Promise<OrderResponseDto> {
    // 获取Agent信息
    const agent = await this.agentRepository.findOne({
      where: { id: dto.agent_id }
    });
    if (!agent) {
      throw new NotFoundException('Agent不存在');
    }

    // 计算价格
    let amount = 0;
    const metadata: any = {};

    switch (dto.type) {
      case OrderType.PER_CALL:
        if (!dto.quantity || dto.quantity < 1) {
          throw new BadRequestException('请指定购买次数');
        }
        amount = Number(agent.cost_per_call) * dto.quantity;
        metadata.quantity = dto.quantity;
        break;

      case OrderType.SUBSCRIPTION:
        if (!dto.duration_months || dto.duration_months < 1) {
          throw new BadRequestException('请指定订阅时长');
        }
        if (!agent.subscription_price_monthly) {
          throw new BadRequestException('此Agent不支持订阅');
        }
        amount = Number(agent.subscription_price_monthly) * dto.duration_months;
        metadata.duration_months = dto.duration_months;
        break;

      case OrderType.BUYOUT:
        if (!agent.buyout_price) {
          throw new BadRequestException('此Agent不支持买断');
        }
        amount = Number(agent.buyout_price);
        break;

      default:
        throw new BadRequestException('无效的订单类型');
    }

    // 应用优惠券（TODO）
    let discountAmount = 0;
    if (dto.coupon_code) {
      // discountAmount = await this.applyCoupon(dto.coupon_code, amount);
      metadata.coupon_code = dto.coupon_code;
    }

    const payAmount = amount - discountAmount;

    // 生成订单号
    const orderNo = this.generateOrderNo();

    // 设置过期时间（30分钟）
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 30);

    const order = this.orderRepository.create({
      order_no: orderNo,
      user_id: userId,
      agent_id: dto.agent_id,
      type: dto.type,
      amount,
      discount_amount: discountAmount,
      pay_amount: payAmount,
      expired_at: expiredAt,
      metadata,
      remark: dto.remark
    });

    await this.orderRepository.save(order);

    // 记录日志
    await this.addLog(order.id, '', OrderStatus.PENDING, '订单创建');

    return this.toResponseDto(order, agent);
  }

  /**
   * 创建充值订单
   */
  async createRecharge(userId: string, dto: CreateRechargeOrderDto): Promise<OrderResponseDto> {
    const orderNo = this.generateOrderNo();

    const order = this.orderRepository.create({
      order_no: orderNo,
      user_id: userId,
      type: OrderType.RECHARGE,
      amount: dto.amount,
      discount_amount: 0,
      pay_amount: dto.amount,
      payment_method: dto.payment_method
    });

    await this.orderRepository.save(order);
    await this.addLog(order.id, '', OrderStatus.PENDING, '充值订单创建');

    return this.toResponseDto(order);
  }

  /**
   * 支付订单
   */
  async pay(userId: string, orderId: string, dto: PayOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['agent']
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('订单状态不允许支付');
    }

    if (order.expired_at && order.expired_at < new Date()) {
      order.status = OrderStatus.EXPIRED;
      await this.orderRepository.save(order);
      throw new BadRequestException('订单已过期');
    }

    // 余额支付
    if (dto.payment_method === PaymentMethod.BALANCE) {
      // TODO: 检查余额并扣款
      // await this.walletService.deduct(userId, order.pay_amount);
      
      order.status = OrderStatus.PAID;
      order.payment_method = dto.payment_method;
      order.paid_at = new Date();
      await this.orderRepository.save(order);

      await this.addLog(order.id, OrderStatus.PENDING, OrderStatus.PAID, '余额支付成功');

      // 执行订单完成逻辑
      await this.completeOrder(order);

      return this.toResponseDto(order, order.agent);
    }

    // 其他支付方式 - 返回支付信息
    order.payment_method = dto.payment_method;
    await this.orderRepository.save(order);

    // TODO: 调用支付网关获取支付信息
    return this.toResponseDto(order, order.agent);
  }

  /**
   * 支付回调
   */
  async paymentCallback(dto: PaymentCallbackDto): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { order_no: dto.order_no }
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== OrderStatus.PENDING) {
      return; // 已处理，幂等返回
    }

    order.status = OrderStatus.PAID;
    order.payment_no = dto.payment_no;
    order.paid_at = dto.paid_at ? new Date(dto.paid_at) : new Date();
    await this.orderRepository.save(order);

    await this.addLog(order.id, OrderStatus.PENDING, OrderStatus.PAID, '支付成功');
    await this.completeOrder(order);
  }

  /**
   * 取消订单
   */
  async cancel(userId: string, orderId: string, dto: CancelOrderDto): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId }
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('只能取消待支付的订单');
    }

    const oldStatus = order.status;
    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    await this.addLog(order.id, oldStatus, OrderStatus.CANCELLED, dto.reason || '用户取消');
  }

  /**
   * 获取订单列表
   */
  async getOrders(userId: string, dto: QueryOrdersDto): Promise<OrderListResponseDto> {
    const { type, status, agent_id, start_date, end_date, page = 1, limit = 20 } = dto;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.agent', 'agent')
      .where('order.user_id = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('order.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (agent_id) {
      queryBuilder.andWhere('order.agent_id = :agent_id', { agent_id });
    }

    if (start_date && end_date) {
      queryBuilder.andWhere('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date
      });
    }

    queryBuilder.orderBy('order.created_at', 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      data: orders.map(o => this.toResponseDto(o, o.agent)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * 获取订单详情
   */
  async getOrder(userId: string, orderId: string): Promise<OrderDetailResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['agent', 'logs', 'refunds']
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return this.toDetailResponseDto(order);
  }

  // ===== 退款 =====

  /**
   * 申请退款
   */
  async requestRefund(
    userId: string, 
    orderId: string, 
    dto: CreateRefundDto
  ): Promise<RefundResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId }
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (![OrderStatus.PAID, OrderStatus.COMPLETED].includes(order.status)) {
      throw new BadRequestException('该订单不支持退款');
    }

    // 检查是否已有退款申请
    const existingRefund = await this.refundRepository.findOne({
      where: { order_id: orderId, status: 'pending' }
    });
    if (existingRefund) {
      throw new BadRequestException('已有退款申请在处理中');
    }

    const refundNo = this.generateRefundNo();

    const refund = this.refundRepository.create({
      refund_no: refundNo,
      order_id: orderId,
      user_id: userId,
      amount: Number(order.pay_amount),
      reason: dto.reason,
      description: dto.description,
      images: dto.images
    });

    await this.refundRepository.save(refund);

    // 更新订单状态
    order.status = OrderStatus.REFUND_PENDING;
    await this.orderRepository.save(order);
    await this.addLog(order.id, OrderStatus.COMPLETED, OrderStatus.REFUND_PENDING, '申请退款');

    return this.toRefundResponseDto(refund);
  }

  /**
   * 处理退款（管理员）
   */
  async processRefund(
    adminId: string, 
    refundId: string, 
    dto: ProcessRefundDto
  ): Promise<RefundResponseDto> {
    const refund = await this.refundRepository.findOne({
      where: { id: refundId },
      relations: ['order']
    });
    if (!refund) {
      throw new NotFoundException('退款申请不存在');
    }

    if (refund.status !== 'pending') {
      throw new BadRequestException('该退款申请已处理');
    }

    refund.admin_id = adminId;
    refund.admin_reply = dto.reply;
    refund.reviewed_at = new Date();

    if (dto.approve) {
      refund.status = 'approved';
      // TODO: 执行退款
      // await this.walletService.refund(refund.user_id, refund.amount);
      refund.status = 'completed';
      refund.completed_at = new Date();

      refund.order.status = OrderStatus.REFUNDED;
      await this.addLog(
        refund.order.id, 
        OrderStatus.REFUND_PENDING, 
        OrderStatus.REFUNDED, 
        '退款成功'
      );
    } else {
      refund.status = 'rejected';
      refund.order.status = OrderStatus.REFUND_REJECTED;
      await this.addLog(
        refund.order.id, 
        OrderStatus.REFUND_PENDING, 
        OrderStatus.REFUND_REJECTED, 
        `退款被拒: ${dto.reply}`
      );
    }

    await this.refundRepository.save(refund);
    await this.orderRepository.save(refund.order);

    return this.toRefundResponseDto(refund);
  }

  // ===== 统计 =====

  /**
   * 获取订单统计
   */
  async getStats(userId: string): Promise<OrderStatsDto> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId }
    });

    const totalAmount = orders
      .filter(o => o.status === OrderStatus.COMPLETED)
      .reduce((sum, o) => sum + Number(o.pay_amount), 0);

    const byType = Object.values(OrderType).map(type => ({
      type,
      count: orders.filter(o => o.type === type).length,
      amount: orders
        .filter(o => o.type === type && o.status === OrderStatus.COMPLETED)
        .reduce((sum, o) => sum + Number(o.pay_amount), 0)
    }));

    return {
      total_orders: orders.length,
      total_amount: totalAmount,
      pending_orders: orders.filter(o => o.status === OrderStatus.PENDING).length,
      completed_orders: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
      refund_orders: orders.filter(o => 
        [OrderStatus.REFUND_PENDING, OrderStatus.REFUNDED].includes(o.status)
      ).length,
      by_type: byType
    };
  }

  /**
   * 导出订单
   */
  async exportOrders(userId: string, dto: ExportOrdersDto): Promise<string> {
    const { type, status, start_date, end_date, format = 'csv' } = dto;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.agent', 'agent')
      .where('order.user_id = :userId', { userId })
      .andWhere('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date
      });

    if (type) {
      queryBuilder.andWhere('order.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const orders = await queryBuilder.getMany();

    // TODO: 生成CSV/Excel文件并返回URL
    // return await this.fileService.generateOrderExport(orders, format);
    return 'export_url_placeholder';
  }

  // ===== 私有方法 =====

  private async completeOrder(order: Order): Promise<void> {
    order.status = OrderStatus.COMPLETED;
    await this.orderRepository.save(order);
    await this.addLog(order.id, OrderStatus.PAID, OrderStatus.COMPLETED, '订单完成');

    // TODO: 根据订单类型执行相应操作
    // - 按次购买：增加用户的使用次数
    // - 订阅：创建订阅记录
    // - 买断：添加永久权限
    // - 充值：增加钱包余额
  }

  private async addLog(
    orderId: string, 
    fromStatus: string, 
    toStatus: string, 
    remark?: string
  ): Promise<void> {
    const log = this.orderLogRepository.create({
      order_id: orderId,
      from_status: fromStatus,
      to_status: toStatus,
      remark,
      operator_type: 'system'
    });
    await this.orderLogRepository.save(log);
  }

  private generateOrderNo(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD${dateStr}${random}`;
  }

  private generateRefundNo(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REF${dateStr}${random}`;
  }

  private toResponseDto(order: Order, agent?: Agent): OrderResponseDto {
    return {
      id: order.id,
      order_no: order.order_no,
      type: order.type,
      status: order.status,
      agent_id: order.agent_id,
      agent_name: agent?.name,
      agent_avatar: agent?.avatar_url,
      amount: Number(order.amount),
      discount_amount: Number(order.discount_amount),
      pay_amount: Number(order.pay_amount),
      payment_method: order.payment_method,
      paid_at: order.paid_at,
      expired_at: order.expired_at,
      metadata: order.metadata,
      created_at: order.created_at
    };
  }

  private toDetailResponseDto(order: Order): OrderDetailResponseDto {
    return {
      ...this.toResponseDto(order, order.agent),
      logs: (order.logs || []).map(log => ({
        from_status: log.from_status,
        to_status: log.to_status,
        remark: log.remark,
        created_at: log.created_at
      })),
      refunds: (order.refunds || []).map(r => this.toRefundResponseDto(r))
    };
  }

  private toRefundResponseDto(refund: Refund): RefundResponseDto {
    return {
      id: refund.id,
      refund_no: refund.refund_no,
      amount: Number(refund.amount),
      reason: refund.reason,
      description: refund.description,
      status: refund.status,
      admin_reply: refund.admin_reply,
      reviewed_at: refund.reviewed_at,
      created_at: refund.created_at
    };
  }
}
