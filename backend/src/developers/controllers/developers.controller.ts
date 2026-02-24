import {
  Controller, Get, Post, Put, Body, Param, Query, Req,
  UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DevelopersService } from '../services/developers.service';
import {
  ApplyDeveloperDto, UpdateDeveloperDto, QueryDevelopersDto,
  DeveloperResponseDto, DeveloperDetailResponseDto, DeveloperListResponseDto,
  QueryEarningsDto, EarningListResponseDto, EarningStatsDto,
  CreateWithdrawalDto, QueryWithdrawalsDto, WithdrawalResponseDto,
  WithdrawalListResponseDto, ProcessWithdrawalDto,
  DeveloperAgentStatsDto, ReviewDeveloperDto
} from '../dto/developer.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('开发者')
@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  // ===== 开发者入驻 =====

  @Post('apply')
  @ApiOperation({ summary: '申请成为开发者' })
  @ApiResponse({ status: 201, type: DeveloperResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async apply(
    @Req() req: any,
    @Body() dto: ApplyDeveloperDto
  ): Promise<DeveloperResponseDto> {
    return this.developersService.apply(req.user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: '获取当前用户的开发者信息' })
  @ApiResponse({ status: 200, type: DeveloperDetailResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any): Promise<DeveloperDetailResponseDto> {
    return this.developersService.getByUserId(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: '更新开发者信息' })
  @ApiResponse({ status: 200, type: DeveloperResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async update(
    @Req() req: any,
    @Body() dto: UpdateDeveloperDto
  ): Promise<DeveloperResponseDto> {
    return this.developersService.update(req.user.id, dto);
  }

  // ===== 收益管理 =====

  @Get('earnings')
  @ApiOperation({ summary: '获取收益列表' })
  @ApiResponse({ status: 200, type: EarningListResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getEarnings(
    @Req() req: any,
    @Query() dto: QueryEarningsDto
  ): Promise<EarningListResponseDto> {
    return this.developersService.getEarnings(req.user.id, dto);
  }

  @Get('earnings/stats')
  @ApiOperation({ summary: '获取收益统计' })
  @ApiResponse({ status: 200, type: EarningStatsDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getEarningStats(@Req() req: any): Promise<EarningStatsDto> {
    return this.developersService.getEarningStats(req.user.id);
  }

  // ===== 提现管理 =====

  @Post('withdrawals')
  @ApiOperation({ summary: '申请提现' })
  @ApiResponse({ status: 201, type: WithdrawalResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async createWithdrawal(
    @Req() req: any,
    @Body() dto: CreateWithdrawalDto
  ): Promise<WithdrawalResponseDto> {
    return this.developersService.createWithdrawal(req.user.id, dto);
  }

  @Get('withdrawals')
  @ApiOperation({ summary: '获取提现列表' })
  @ApiResponse({ status: 200, type: WithdrawalListResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getWithdrawals(
    @Req() req: any,
    @Query() dto: QueryWithdrawalsDto
  ): Promise<WithdrawalListResponseDto> {
    return this.developersService.getWithdrawals(req.user.id, dto);
  }

  // ===== Agent管理 =====

  @Get('agents/stats')
  @ApiOperation({ summary: '获取开发者的Agent统计' })
  @ApiResponse({ status: 200, type: DeveloperAgentStatsDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getAgentStats(@Req() req: any): Promise<DeveloperAgentStatsDto> {
    return this.developersService.getAgentStats(req.user.id);
  }

  // ===== 管理员功能 =====

  @Get('admin/list')
  @ApiOperation({ summary: '获取开发者列表（管理员）' })
  @ApiResponse({ status: 200, type: DeveloperListResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async list(@Query() dto: QueryDevelopersDto): Promise<DeveloperListResponseDto> {
    return this.developersService.list(dto);
  }

  @Put('admin/:id/review')
  @ApiOperation({ summary: '审核开发者（管理员）' })
  @ApiResponse({ status: 200, type: DeveloperResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewDeveloperDto
  ): Promise<DeveloperResponseDto> {
    return this.developersService.review(id, dto);
  }

  @Put('admin/withdrawals/:id/process')
  @ApiOperation({ summary: '处理提现（管理员）' })
  @ApiResponse({ status: 200, type: WithdrawalResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async processWithdrawal(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ProcessWithdrawalDto
  ): Promise<WithdrawalResponseDto> {
    return this.developersService.processWithdrawal(req.user.id, id, dto);
  }
}
