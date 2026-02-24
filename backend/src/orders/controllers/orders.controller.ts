import {
  Controller, Get, Post, Put, Body, Param, Query, Req,
  UseGuards, HttpCode, HttpStatus, Res
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { OrdersService } from '../services/orders.service';
import {
  CreateOrderDto, CreateRechargeOrderDto, PayOrderDto, QueryOrdersDto,
  OrderResponseDto, OrderListResponseDto, OrderDetailResponseDto,
  CreateRefundDto, RefundResponseDto, ProcessRefundDto,
  OrderStatsDto, ExportOrdersDto, CancelOrderDto, PaymentCallbackDto
} from '../dto/order.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('订单')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '创建订单' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: any,
    @Body() dto: CreateOrderDto
  ): Promise<OrderResponseDto> {
    return this.ordersService.create(req.user.id, dto);
  }

  @Post('recharge')
  @ApiOperation({ summary: '创建充值订单' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async createRecharge(
    @Req() req: any,
    @Body() dto: CreateRechargeOrderDto
  ): Promise<OrderResponseDto> {
    return this.ordersService.createRecharge(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  @ApiResponse({ status: 200, type: OrderListResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getOrders(
    @Req() req: any,
    @Query() dto: QueryOrdersDto
  ): Promise<OrderListResponseDto> {
    return this.ordersService.getOrders(req.user.id, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取订单统计' })
  @ApiResponse({ status: 200, type: OrderStatsDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getStats(@Req() req: any): Promise<OrderStatsDto> {
    return this.ordersService.getStats(req.user.id);
  }

  @Get('export')
  @ApiOperation({ summary: '导出订单' })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async exportOrders(
    @Req() req: any,
    @Query() dto: ExportOrdersDto,
    @Res() res: Response
  ): Promise<void> {
    const exportUrl = await this.ordersService.exportOrders(req.user.id, dto);
    res.redirect(exportUrl);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  @ApiResponse({ status: 200, type: OrderDetailResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getOrder(
    @Req() req: any,
    @Param('id') id: string
  ): Promise<OrderDetailResponseDto> {
    return this.ordersService.getOrder(req.user.id, id);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: '支付订单' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async pay(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: PayOrderDto
  ): Promise<OrderResponseDto> {
    return this.ordersService.pay(req.user.id, id, dto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '取消订单' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async cancel(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: CancelOrderDto
  ): Promise<void> {
    return this.ordersService.cancel(req.user.id, id, dto);
  }

  // ===== 支付回调 =====

  @Post('callback/payment')
  @ApiOperation({ summary: '支付回调' })
  @HttpCode(HttpStatus.OK)
  async paymentCallback(@Body() dto: PaymentCallbackDto): Promise<string> {
    await this.ordersService.paymentCallback(dto);
    return 'success';
  }

  // ===== 退款 =====

  @Post(':id/refund')
  @ApiOperation({ summary: '申请退款' })
  @ApiResponse({ status: 201, type: RefundResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async requestRefund(
    @Req() req: any,
    @Param('id') orderId: string,
    @Body() dto: CreateRefundDto
  ): Promise<RefundResponseDto> {
    return this.ordersService.requestRefund(req.user.id, orderId, dto);
  }

  @Put('refunds/:refund_id/process')
  @ApiOperation({ summary: '处理退款（管理员）' })
  @ApiResponse({ status: 200, type: RefundResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async processRefund(
    @Req() req: any,
    @Param('refund_id') refundId: string,
    @Body() dto: ProcessRefundDto
  ): Promise<RefundResponseDto> {
    return this.ordersService.processRefund(req.user.id, refundId, dto);
  }
}
