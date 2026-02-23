import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationSettingsDto } from './dto/notification-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  /**
   * GET /notifications
   * 获取通知列表
   */
  @Get()
  async findAll(@Request() req) {
    return this.notificationsService.findAll(req.user.id);
  }

  /**
   * PUT /notifications/:id/read
   * 标记已读
   */
  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  /**
   * GET /notifications/settings
   * 获取通知设置
   */
  @Get('settings')
  async getSettings(@Request() req) {
    return this.notificationsService.getSettings(req.user.id);
  }

  /**
   * POST /notifications/settings
   * 更新通知设置
   */
  @Post('settings')
  async updateSettings(
    @Body() dto: NotificationSettingsDto,
    @Request() req,
  ) {
    return this.notificationsService.updateSettings(req.user.id, dto);
  }
}
