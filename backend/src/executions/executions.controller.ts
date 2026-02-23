import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('executions')
@UseGuards(JwtAuthGuard)
export class ExecutionsController {
  constructor(private executionsService: ExecutionsService) {}

  /**
   * GET /executions
   * 获取用户执行历史
   */
  @Get()
  async findAll(@Request() req) {
    return this.executionsService.findAll(req.user.id);
  }

  /**
   * GET /executions/:id
   * 获取执行详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.executionsService.findOne(id, req.user.id);
  }

  /**
   * POST /executions
   * 创建执行记录
   */
  @Post()
  async create(@Body() dto: CreateExecutionDto, @Request() req) {
    return this.executionsService.create(dto, req.user.id);
  }
}
