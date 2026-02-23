import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  /**
   * GET /agents
   * 获取所有 Agent（支持过滤）
   */
  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('ownerId') ownerId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.agentsService.findAll({
      category,
      ownerId,
      isActive: isActive === undefined ? undefined : isActive === 'true',
    });
  }

  /**
   * GET /agents/:id
   * 获取单个 Agent
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  /**
   * POST /agents
   * 创建新 Agent（需要认证）
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateAgentDto, @Request() req) {
    return this.agentsService.create(dto, req.user.id);
  }

  /**
   * PUT /agents/:id
   * 更新 Agent（需要认证，仅 owner）
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAgentDto,
    @Request() req,
  ) {
    return this.agentsService.update(id, dto, req.user.id);
  }

  /**
   * DELETE /agents/:id
   * 删除 Agent（需要认证，仅 owner）
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.agentsService.remove(id, req.user.id);
    return { message: 'Agent deleted successfully' };
  }
}
