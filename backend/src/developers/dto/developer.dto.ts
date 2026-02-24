import { 
  IsString, IsOptional, IsUUID, IsInt, Min, Max, MaxLength, 
  IsArray, IsEnum, IsNumber, IsDateString, IsEmail, IsUrl, IsBoolean 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  DeveloperStatus, DeveloperLevel, 
  WithdrawalMethod, WithdrawalStatus 
} from '../../entities/developer.entity';

// ===== 开发者入驻 =====
export class ApplyDeveloperDto {
  @ApiProperty({ description: '显示名称' })
  @IsString()
  @MaxLength(50)
  display_name: string;

  @ApiPropertyOptional({ description: '公司名称' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company_name?: string;

  @ApiPropertyOptional({ description: '介绍' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ description: '网站' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'GitHub' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({ description: '联系邮箱' })
  @IsEmail()
  contact_email: string;
}

export class UpdateDeveloperDto extends PartialType(ApplyDeveloperDto) {}

// ===== 查询 =====
export class QueryDevelopersDto {
  @ApiPropertyOptional({ description: '状态', enum: DeveloperStatus })
  @IsOptional()
  @IsEnum(DeveloperStatus)
  status?: DeveloperStatus;

  @ApiPropertyOptional({ description: '等级', enum: DeveloperLevel })
  @IsOptional()
  @IsEnum(DeveloperLevel)
  level?: DeveloperLevel;

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}

// ===== 响应 =====
export class DeveloperResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  display_name: string;

  @ApiPropertyOptional()
  company_name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  github?: string;

  @ApiProperty()
  status: DeveloperStatus;

  @ApiProperty()
  level: DeveloperLevel;

  @ApiProperty()
  commission_rate: number;

  @ApiProperty()
  agent_count: number;

  @ApiProperty()
  active_agent_count: number;

  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  total_sales: number;

  @ApiProperty()
  avg_rating: number;

  @ApiProperty()
  created_at: Date;

  @ApiPropertyOptional()
  approved_at?: Date;
}

export class DeveloperDetailResponseDto extends DeveloperResponseDto {
  @ApiProperty()
  balance: number;

  @ApiProperty()
  total_withdrawn: number;

  @ApiPropertyOptional()
  contact_email?: string;

  @ApiPropertyOptional()
  reject_reason?: string;
}

export class DeveloperListResponseDto {
  @ApiProperty({ type: [DeveloperResponseDto] })
  data: DeveloperResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

// ===== 收益 =====
export class QueryEarningsDto {
  @ApiPropertyOptional({ description: 'Agent ID' })
  @IsOptional()
  @IsUUID()
  agent_id?: string;

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}

export class EarningItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  agent_id: string;

  @ApiProperty()
  agent_name: string;

  @ApiProperty()
  order_id: string;

  @ApiProperty()
  order_amount: number;

  @ApiProperty()
  commission_rate: number;

  @ApiProperty()
  platform_fee: number;

  @ApiProperty()
  earning_amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  created_at: Date;
}

export class EarningListResponseDto {
  @ApiProperty({ type: [EarningItemDto] })
  data: EarningItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class EarningStatsDto {
  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  total_earnings: number;

  @ApiProperty()
  total_platform_fee: number;

  @ApiProperty()
  pending_earnings: number;

  @ApiProperty()
  settled_earnings: number;

  @ApiProperty({ description: '今日收益' })
  today_earnings: number;

  @ApiProperty({ description: '本周收益' })
  week_earnings: number;

  @ApiProperty({ description: '本月收益' })
  month_earnings: number;

  @ApiProperty({ description: '按Agent统计' })
  by_agent: {
    agent_id: string;
    agent_name: string;
    earnings: number;
    order_count: number;
  }[];
}

// ===== 提现 =====
export class CreateWithdrawalDto {
  @ApiProperty({ description: '提现金额' })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ description: '提现方式', enum: WithdrawalMethod })
  @IsEnum(WithdrawalMethod)
  method: WithdrawalMethod;

  @ApiProperty({ description: '账户信息' })
  account_info: {
    bank_name?: string;
    bank_account?: string;
    account_name?: string;
    alipay_account?: string;
    paypal_email?: string;
  };
}

export class QueryWithdrawalsDto {
  @ApiPropertyOptional({ description: '状态', enum: WithdrawalStatus })
  @IsOptional()
  @IsEnum(WithdrawalStatus)
  status?: WithdrawalStatus;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}

export class WithdrawalResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  withdrawal_no: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  fee: number;

  @ApiProperty()
  actual_amount: number;

  @ApiProperty()
  method: WithdrawalMethod;

  @ApiProperty()
  status: WithdrawalStatus;

  @ApiPropertyOptional()
  reject_reason?: string;

  @ApiPropertyOptional()
  processed_at?: Date;

  @ApiPropertyOptional()
  completed_at?: Date;

  @ApiProperty()
  created_at: Date;
}

export class WithdrawalListResponseDto {
  @ApiProperty({ type: [WithdrawalResponseDto] })
  data: WithdrawalResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class ProcessWithdrawalDto {
  @ApiProperty({ description: '是否同意' })
  @IsBoolean()
  approve: boolean;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}

// ===== Agent 管理 =====
export class DeveloperAgentStatsDto {
  @ApiProperty()
  total_agents: number;

  @ApiProperty()
  active_agents: number;

  @ApiProperty()
  pending_agents: number;

  @ApiProperty()
  suspended_agents: number;

  @ApiProperty()
  total_executions: number;

  @ApiProperty()
  total_revenue: number;

  @ApiProperty({ type: [Object] })
  agents: {
    id: string;
    name: string;
    status: string;
    executions: number;
    revenue: number;
    rating: number;
  }[];
}

// ===== 审核 =====
export class ReviewDeveloperDto {
  @ApiProperty({ description: '是否通过' })
  @IsBoolean()
  approve: boolean;

  @ApiPropertyOptional({ description: '拒绝原因' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reject_reason?: string;
}
