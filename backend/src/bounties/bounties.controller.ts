import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BountiesService } from './bounties.service';
import { CreateBountyDto } from './dto/create-bounty.dto';
import { ApplyBountyDto } from './dto/apply-bounty.dto';
import { DeliverBountyDto } from './dto/deliver-bounty.dto';
import { QueryBountyDto } from './dto/query-bounty.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bounties')
export class BountiesController {
  constructor(private bountiesService: BountiesService) {}

  /**
   * POST /bounties
   * 发布悬赏
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateBountyDto, @Request() req) {
    return this.bountiesService.create(dto, req.user.id);
  }

  /**
   * GET /bounties
   * 悬赏大厅（支持筛选排序分页）
   */
  @Get()
  async findAll(@Query() query: QueryBountyDto) {
    return this.bountiesService.findAll(query);
  }

  /**
   * GET /bounties/my/created
   * 我发布的悬赏
   */
  @UseGuards(JwtAuthGuard)
  @Get('my/created')
  async getMyCreated(@Request() req) {
    return this.bountiesService.getMyBounties(req.user.id, 'creator');
  }

  /**
   * GET /bounties/my/assigned
   * 我接的悬赏
   */
  @UseGuards(JwtAuthGuard)
  @Get('my/assigned')
  async getMyAssigned(@Request() req) {
    return this.bountiesService.getMyBounties(req.user.id, 'assignee');
  }

  /**
   * GET /bounties/:id
   * 悬赏详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bountiesService.findOne(id);
  }

  /**
   * POST /bounties/:id/apply
   * 申请接单
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  async apply(
    @Param('id') id: string,
    @Body() dto: ApplyBountyDto,
    @Request() req,
  ) {
    return this.bountiesService.apply(id, dto, req.user.id);
  }

  /**
   * PUT /bounties/:id/accept/:applicationId
   * 接受申请
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id/accept/:applicationId')
  async acceptApplication(
    @Param('id') id: string,
    @Param('applicationId') applicationId: string,
    @Request() req,
  ) {
    return this.bountiesService.acceptApplication(id, applicationId, req.user.id);
  }

  /**
   * POST /bounties/:id/deliver
   * 提交交付
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/deliver')
  async deliver(
    @Param('id') id: string,
    @Body() dto: DeliverBountyDto,
    @Request() req,
  ) {
    return this.bountiesService.deliver(id, dto, req.user.id);
  }

  /**
   * PUT /bounties/:id/complete
   * 验收完成
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id/complete')
  async complete(@Param('id') id: string, @Request() req) {
    return this.bountiesService.complete(id, req.user.id);
  }

  /**
   * PUT /bounties/:id/cancel
   * 取消悬赏
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req) {
    return this.bountiesService.cancel(id, req.user.id);
  }
}
