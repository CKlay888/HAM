import { 
  IsString, IsOptional, IsUUID, IsInt, Min, Max, MaxLength, 
  IsArray, IsEnum, IsNumber, IsDateString 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderStatus, OrderType, PaymentMethod } from '../../entities/order.entity';

// ===== 创建订单 =====
export class CreateOrderDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsUUID()
  agent_id: string;

  @ApiProperty({ description: '订单类型', enum: OrderType })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiPropertyOptional({ description: '数量（按次购买时使用）' })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ description: '订阅时长（月）' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  duration_months?: number;

  @ApiPropertyOptional({ description: '优惠码' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  coupon_code?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  remark?: string;
}

export class CreateRechargeOrderDto {
  @ApiProperty({ description: '充值金额' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ description: '支付方式', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}

// ===== 支付 =====
export class PayOrderDto {
  @ApiProperty({ description: '支付方式', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}

export class PaymentCallbackDto {
  @ApiProperty({ description: '订单号' })
  @IsString()
  order_no: string;

  @ApiProperty({ description: '支付流水号' })
  @IsString()
  payment_no: string;

  @ApiPropertyOptional({ description: '支付时间' })
  @IsOptional()
  @IsDateString()
  paid_at?: string;
}

// ===== 查询 =====
export class QueryOrdersDto {
  @ApiPropertyOptional({ description: '订单类型', enum: OrderType })
  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;

  @ApiPropertyOptional({ description: '订单状态', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

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

// ===== 响应 =====
export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order_no: string;

  @ApiProperty()
  type: OrderType;

  @ApiProperty()
  status: OrderStatus;

  @ApiPropertyOptional()
  agent_id?: string;

  @ApiPropertyOptional()
  agent_name?: string;

  @ApiPropertyOptional()
  agent_avatar?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  discount_amount: number;

  @ApiProperty()
  pay_amount: number;

  @ApiPropertyOptional()
  payment_method?: PaymentMethod;

  @ApiPropertyOptional()
  paid_at?: Date;

  @ApiPropertyOptional()
  expired_at?: Date;

  @ApiPropertyOptional()
  metadata?: {
    quantity?: number;
    duration_months?: number;
    coupon_code?: string;
    remark?: string;
  };

  @ApiProperty()
  created_at: Date;
}

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  data: OrderResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class OrderDetailResponseDto extends OrderResponseDto {
  @ApiProperty({ type: [OrderLogDto] })
  logs: OrderLogDto[];

  @ApiPropertyOptional({ type: [RefundResponseDto] })
  refunds?: RefundResponseDto[];
}

export class OrderLogDto {
  @ApiProperty()
  from_status: string;

  @ApiProperty()
  to_status: string;

  @ApiPropertyOptional()
  remark?: string;

  @ApiProperty()
  created_at: Date;
}

// ===== 退款 =====
export class CreateRefundDto {
  @ApiProperty({ description: '退款原因' })
  @IsString()
  @MaxLength(100)
  reason: string;

  @ApiPropertyOptional({ description: '详细描述' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: '图片凭证' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class RefundResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  refund_no: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  reason: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  admin_reply?: string;

  @ApiPropertyOptional()
  reviewed_at?: Date;

  @ApiProperty()
  created_at: Date;
}

export class ProcessRefundDto {
  @ApiProperty({ description: '是否同意' })
  approve: boolean;

  @ApiPropertyOptional({ description: '回复' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reply?: string;
}

// ===== 统计 =====
export class OrderStatsDto {
  @ApiProperty()
  total_orders: number;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  pending_orders: number;

  @ApiProperty()
  completed_orders: number;

  @ApiProperty()
  refund_orders: number;

  @ApiProperty({ description: '按类型统计' })
  by_type: {
    type: string;
    count: number;
    amount: number;
  }[];
}

// ===== 导出 =====
export class ExportOrdersDto {
  @ApiPropertyOptional({ description: '订单类型', enum: OrderType })
  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;

  @ApiPropertyOptional({ description: '订单状态', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ description: '开始日期' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: '结束日期' })
  @IsDateString()
  end_date: string;

  @ApiPropertyOptional({ description: '导出格式', default: 'csv' })
  @IsOptional()
  @IsString()
  format?: string; // csv, xlsx
}

export class CancelOrderDto {
  @ApiPropertyOptional({ description: '取消原因' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}
