import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('purchases')
@UseGuards(JwtAuthGuard) // 所有端点都需要认证
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  /**
   * GET /purchases
   * 获取当前用户的购买记录
   */
  @Get()
  async findAll(@Request() req) {
    return this.purchasesService.findAll(req.user.id);
  }

  /**
   * GET /purchases/:id
   * 获取订单详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.purchasesService.findOne(id, req.user.id);
  }

  /**
   * POST /purchases
   * 创建购买订单
   */
  @Post()
  async create(@Body() dto: CreatePurchaseDto, @Request() req) {
    return this.purchasesService.create(dto, req.user.id);
  }
}
