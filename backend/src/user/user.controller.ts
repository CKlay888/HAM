import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RechargeDto } from './dto/recharge.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET /user/profile
   * 获取用户资料
   */
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  /**
   * PUT /user/profile
   * 更新用户资料
   */
  @Put('profile')
  async updateProfile(@Body() dto: UpdateProfileDto, @Request() req) {
    return this.userService.updateProfile(req.user.id, dto);
  }

  /**
   * GET /user/balance
   * 查询余额
   */
  @Get('balance')
  async getBalance(@Request() req) {
    return this.userService.getBalance(req.user.id);
  }

  /**
   * POST /user/recharge
   * 充值（模拟）
   */
  @Post('recharge')
  async recharge(@Body() dto: RechargeDto, @Request() req) {
    return this.userService.recharge(req.user.id, dto);
  }

  /**
   * GET /user/orders
   * 我的订单
   */
  @Get('orders')
  async getOrders(@Request() req) {
    return this.userService.getOrders(req.user.id);
  }

  /**
   * GET /user/agents
   * 我购买的 Agent
   */
  @Get('agents')
  async getMyAgents(@Request() req) {
    return this.userService.getMyAgents(req.user.id);
  }
}
