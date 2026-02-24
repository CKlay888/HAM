import { 
  Injectable, NotFoundException, BadRequestException, 
  ForbiddenException, ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { 
  Developer, DeveloperEarning, Withdrawal,
  DeveloperStatus, DeveloperLevel, WithdrawalStatus 
} from '../../entities/developer.entity';
import { Agent } from '../../entities/agent.entity';
import { User } from '../../entities/user.entity';
import {
  ApplyDeveloperDto, UpdateDeveloperDto, QueryDevelopersDto,
  DeveloperResponseDto, DeveloperDetailResponseDto, DeveloperListResponseDto,
  QueryEarningsDto, EarningItemDto, EarningListResponseDto, EarningStatsDto,
  CreateWithdrawalDto, QueryWithdrawalsDto, WithdrawalResponseDto,
  WithdrawalListResponseDto, ProcessWithdrawalDto,
  DeveloperAgentStatsDto, ReviewDeveloperDto
} from '../dto/developer.dto';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private readonly developerRepository: Repository<Developer>,
    @InjectRepository(DeveloperEarning)
    private readonly earningRepository: Repository<DeveloperEarning>,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ===== 开发者入驻 =====

  /**
   * 申请成为开发者
   */
  async apply(userId: string, dto: ApplyDeveloperDto): Promise<DeveloperResponseDto> {
    // 检查是否已申请
    const existing = await this.developerRepository.findOne({
      where: { user_id: userId }
    });
    if (existing) {
      if (existing.status === DeveloperStatus.APPROVED) {
        throw new ConflictException('您已是开发者');
      }
      if (existing.status === DeveloperStatus.PENDING) {
        throw new ConflictException('您的申请正在审核中');
      }
      // 如果被拒绝，可以重新申请
    }

    const developer = this.developerRepository.create({
      user_id: userId,
      ...dto,
      status: DeveloperStatus.PENDING
    });

    await this.developerRepository.save(developer);
    return this.toResponseDto(developer);
  }

  /**
   * 更新开发者信息
   */
  async update(userId: string, dto: UpdateDeveloperDto): Promise<DeveloperResponseDto> {
    const developer = await this.developerRepository.findOne({
      where: { user_id: userId }
    });
    if (!developer) {
      throw new NotFoundException('开发者信息不存在');
    }

    Object.assign(developer, dto);
    await this.developerRepository.save(developer);
    return this.toResponseDto(developer);
  }

  /**
   * 获取开发者信息
   */
  async getByUserId(userId: string): Promise<DeveloperDetailResponseDto> {
    const developer = await this.developerRepository.findOne({
      where: { user_id: userId }
    });
    if (!developer) {
      throw new NotFoundException('开发者信息不存在');
    }
    return this.toDetailResponseDto(developer);
  }

  /**
   * 获取开发者列表（管理）
   */
  async list(dto: QueryDevelopersDto): Promise<DeveloperListResponseDto> {
    const { status, level, keyword, page = 1, limit = 20 } = dto;

    const queryBuilder = this.developerRepository.createQueryBuilder('developer')
      .leftJoinAndSelect('developer.user', 'user');

    if (status) {
      queryBuilder.andWhere('developer.status = :status', { status });
    }

    if (level) {
      queryBuilder.andWhere('developer.level = :level', { level });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(developer.display_name ILIKE :keyword OR developer.company_name ILIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    queryBuilder.orderBy('developer.created_at', 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [developers, total] = await queryBuilder.getManyAndCount();

    return {
      data: developers.map(d => this.toResponseDto(d)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * 审核开发者（管理员）
   */
  async review(developerId: string, dto: ReviewDeveloperDto): Promise<DeveloperResponseDto> {
    const developer = await this.developerRepository.findOne({
      where: { id: developerId }
    });
    if (!developer) {
      throw new NotFoundException('开发者不存在');
    }

    if (developer.status !== DeveloperStatus.PENDING) {
      throw new BadRequestException('该申请已处理');
    }

    if (dto.approve) {
      developer.status = DeveloperStatus.APPROVED;
      developer.approved_at = new Date();
    } else {
      developer.status = DeveloperStatus.REJECTED;
      developer.reject_reason = dto.reject_reason;
    }

    await this.developerRepository.save(developer);
    return this.toResponseDto(developer);
  }

  // ===== 收益管理 =====

  /**
   * 获取收益列表
   */
  async getEarnings(userId: string, dto: QueryEarningsDto): Promise<EarningListResponseDto> {
    const developer = await this.getDeveloperByUserId(userId);

    const { agent_id, start_date, end_date, page = 1, limit = 20 } = dto;

    const queryBuilder = this.earningRepository.createQueryBuilder('earning')
      .where('earning.developer_id = :developerId', { developerId: developer.id });

    if (agent_id) {
      queryBuilder.andWhere('earning.agent_id = :agent_id', { agent_id });
    }

    if (start_date && end_date) {
      queryBuilder.andWhere('earning.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date
      });
    }

    queryBuilder.orderBy('earning.created_at', 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [earnings, total] = await queryBuilder.getManyAndCount();

    // 获取Agent名称
    const agentIds = [...new Set(earnings.map(e => e.agent_id))];
    const agents = await this.agentRepository.findByIds(agentIds);
    const agentMap = new Map(agents.map(a => [a.id, a.name]));

    return {
      data: earnings.map(e => ({
        id: e.id,
        agent_id: e.agent_id,
        agent_name: agentMap.get(e.agent_id) || 'Unknown',
        order_id: e.order_id,
        order_amount: Number(e.order_amount),
        commission_rate: Number(e.commission_rate),
        platform_fee: Number(e.platform_fee),
        earning_amount: Number(e.earning_amount),
        status: e.status,
        created_at: e.created_at
      })),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * 获取收益统计
   */
  async getEarningStats(userId: string): Promise<EarningStatsDto> {
    const developer = await this.getDeveloperByUserId(userId);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 总收益
    const earnings = await this.earningRepository.find({
      where: { developer_id: developer.id }
    });

    const totalRevenue = earnings.reduce((sum, e) => sum + Number(e.order_amount), 0);
    const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.earning_amount), 0);
    const totalPlatformFee = earnings.reduce((sum, e) => sum + Number(e.platform_fee), 0);
    const pendingEarnings = earnings
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + Number(e.earning_amount), 0);
    const settledEarnings = earnings
      .filter(e => e.status === 'settled')
      .reduce((sum, e) => sum + Number(e.earning_amount), 0);

    // 时间段收益
    const todayEarnings = earnings
      .filter(e => e.created_at >= todayStart)
      .reduce((sum, e) => sum + Number(e.earning_amount), 0);
    const weekEarnings = earnings
      .filter(e => e.created_at >= weekStart)
      .reduce((sum, e) => sum + Number(e.earning_amount), 0);
    const monthEarnings = earnings
      .filter(e => e.created_at >= monthStart)
      .reduce((sum, e) => sum + Number(e.earning_amount), 0);

    // 按Agent统计
    const agentStats = new Map<string, { earnings: number; count: number }>();
    for (const e of earnings) {
      const stat = agentStats.get(e.agent_id) || { earnings: 0, count: 0 };
      stat.earnings += Number(e.earning_amount);
      stat.count += 1;
      agentStats.set(e.agent_id, stat);
    }

    const agentIds = [...agentStats.keys()];
    const agents = await this.agentRepository.findByIds(agentIds);
    const agentMap = new Map(agents.map(a => [a.id, a.name]));

    return {
      total_revenue: totalRevenue,
      total_earnings: totalEarnings,
      total_platform_fee: totalPlatformFee,
      pending_earnings: pendingEarnings,
      settled_earnings: settledEarnings,
      today_earnings: todayEarnings,
      week_earnings: weekEarnings,
      month_earnings: monthEarnings,
      by_agent: [...agentStats.entries()].map(([agentId, stat]) => ({
        agent_id: agentId,
        agent_name: agentMap.get(agentId) || 'Unknown',
        earnings: stat.earnings,
        order_count: stat.count
      }))
    };
  }

  // ===== 提现管理 =====

  /**
   * 申请提现
   */
  async createWithdrawal(userId: string, dto: CreateWithdrawalDto): Promise<WithdrawalResponseDto> {
    const developer = await this.getDeveloperByUserId(userId);

    if (developer.status !== DeveloperStatus.APPROVED) {
      throw new ForbiddenException('开发者身份未通过审核');
    }

    // 检查余额
    if (dto.amount > Number(developer.balance)) {
      throw new BadRequestException('余额不足');
    }

    // 检查最低提现金额
    const minWithdrawal = 100;
    if (dto.amount < minWithdrawal) {
      throw new BadRequestException(`最低提现金额为${minWithdrawal}元`);
    }

    // 检查是否有待处理的提现
    const pendingWithdrawal = await this.withdrawalRepository.findOne({
      where: { 
        developer_id: developer.id, 
        status: WithdrawalStatus.PENDING 
      }
    });
    if (pendingWithdrawal) {
      throw new BadRequestException('您有一笔提现申请正在处理中');
    }

    // 计算手续费
    const feeRate = 0.01; // 1%
    const fee = Math.ceil(dto.amount * feeRate * 100) / 100;
    const actualAmount = dto.amount - fee;

    const withdrawalNo = this.generateWithdrawalNo();

    const withdrawal = this.withdrawalRepository.create({
      withdrawal_no: withdrawalNo,
      developer_id: developer.id,
      amount: dto.amount,
      fee,
      actual_amount: actualAmount,
      method: dto.method,
      account_info: dto.account_info
    });

    await this.withdrawalRepository.save(withdrawal);

    // 冻结余额
    developer.balance = Number(developer.balance) - dto.amount;
    await this.developerRepository.save(developer);

    return this.toWithdrawalResponseDto(withdrawal);
  }

  /**
   * 获取提现列表
   */
  async getWithdrawals(userId: string, dto: QueryWithdrawalsDto): Promise<WithdrawalListResponseDto> {
    const developer = await this.getDeveloperByUserId(userId);

    const { status, page = 1, limit = 20 } = dto;

    const queryBuilder = this.withdrawalRepository.createQueryBuilder('withdrawal')
      .where('withdrawal.developer_id = :developerId', { developerId: developer.id });

    if (status) {
      queryBuilder.andWhere('withdrawal.status = :status', { status });
    }

    queryBuilder.orderBy('withdrawal.created_at', 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [withdrawals, total] = await queryBuilder.getManyAndCount();

    return {
      data: withdrawals.map(w => this.toWithdrawalResponseDto(w)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * 处理提现（管理员）
   */
  async processWithdrawal(
    adminId: string, 
    withdrawalId: string, 
    dto: ProcessWithdrawalDto
  ): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id: withdrawalId },
      relations: ['developer']
    });
    if (!withdrawal) {
      throw new NotFoundException('提现申请不存在');
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('该提现申请已处理');
    }

    withdrawal.admin_id = adminId;
    withdrawal.admin_remark = dto.remark;
    withdrawal.processed_at = new Date();

    if (dto.approve) {
      withdrawal.status = WithdrawalStatus.PROCESSING;
      // TODO: 调用支付接口进行打款
      // 打款成功后更新状态
      withdrawal.status = WithdrawalStatus.COMPLETED;
      withdrawal.completed_at = new Date();

      // 更新开发者已提现金额
      withdrawal.developer.total_withdrawn = 
        Number(withdrawal.developer.total_withdrawn) + Number(withdrawal.amount);
      await this.developerRepository.save(withdrawal.developer);
    } else {
      withdrawal.status = WithdrawalStatus.REJECTED;
      // 退还冻结金额
      withdrawal.developer.balance = 
        Number(withdrawal.developer.balance) + Number(withdrawal.amount);
      await this.developerRepository.save(withdrawal.developer);
    }

    await this.withdrawalRepository.save(withdrawal);
    return this.toWithdrawalResponseDto(withdrawal);
  }

  // ===== Agent管理 =====

  /**
   * 获取开发者的Agent统计
   */
  async getAgentStats(userId: string): Promise<DeveloperAgentStatsDto> {
    const developer = await this.getDeveloperByUserId(userId);

    const agents = await this.agentRepository.find({
      where: { creator_id: userId }
    });

    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.status === 'active').length;
    const pendingAgents = agents.filter(a => a.status === 'pending_review').length;
    const suspendedAgents = agents.filter(a => a.status === 'suspended').length;

    const totalExecutions = agents.reduce((sum, a) => sum + a.total_executions, 0);
    const totalRevenue = agents.reduce((sum, a) => sum + Number(a.total_revenue), 0);

    return {
      total_agents: totalAgents,
      active_agents: activeAgents,
      pending_agents: pendingAgents,
      suspended_agents: suspendedAgents,
      total_executions: totalExecutions,
      total_revenue: totalRevenue,
      agents: agents.map(a => ({
        id: a.id,
        name: a.name,
        status: a.status,
        executions: a.total_executions,
        revenue: Number(a.total_revenue),
        rating: Number(a.value_score)
      }))
    };
  }

  // ===== 私有方法 =====

  private async getDeveloperByUserId(userId: string): Promise<Developer> {
    const developer = await this.developerRepository.findOne({
      where: { user_id: userId }
    });
    if (!developer) {
      throw new NotFoundException('开发者信息不存在');
    }
    return developer;
  }

  private generateWithdrawalNo(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `WD${dateStr}${random}`;
  }

  private toResponseDto(developer: Developer): DeveloperResponseDto {
    return {
      id: developer.id,
      user_id: developer.user_id,
      display_name: developer.display_name,
      company_name: developer.company_name,
      description: developer.description,
      website: developer.website,
      github: developer.github,
      status: developer.status,
      level: developer.level,
      commission_rate: Number(developer.commission_rate),
      agent_count: developer.agent_count,
      active_agent_count: developer.active_agent_count,
      total_revenue: Number(developer.total_revenue),
      total_sales: developer.total_sales,
      avg_rating: Number(developer.avg_rating),
      created_at: developer.created_at,
      approved_at: developer.approved_at
    };
  }

  private toDetailResponseDto(developer: Developer): DeveloperDetailResponseDto {
    return {
      ...this.toResponseDto(developer),
      balance: Number(developer.balance),
      total_withdrawn: Number(developer.total_withdrawn),
      contact_email: developer.contact_email,
      reject_reason: developer.reject_reason
    };
  }

  private toWithdrawalResponseDto(withdrawal: Withdrawal): WithdrawalResponseDto {
    return {
      id: withdrawal.id,
      withdrawal_no: withdrawal.withdrawal_no,
      amount: Number(withdrawal.amount),
      fee: Number(withdrawal.fee),
      actual_amount: Number(withdrawal.actual_amount),
      method: withdrawal.method,
      status: withdrawal.status,
      reject_reason: withdrawal.reject_reason,
      processed_at: withdrawal.processed_at,
      completed_at: withdrawal.completed_at,
      created_at: withdrawal.created_at
    };
  }
}
