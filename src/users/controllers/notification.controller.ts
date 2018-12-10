import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { NotificationVm } from 'src/api/notifications/vm/notification.vm';
import { CreatePushSubscriptionDto } from 'src/users/dto/create-push-subscription.dto';
import { MarkNotificationsReadDto } from 'src/users/dto/mark-notifications-read.dto';
import { UpdateNotificationSettingsDto } from 'src/users/dto/update-notification-settings.dto';
import { INotificationSettings } from 'src/users/interfaces/notification-settings.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { UserNotificationsService } from 'src/users/services/user-notifications.service';
import { NotificationSettingsVm } from 'src/users/vm/notification-settings.vm';
import { Output } from 'src/common/output.decorator';
import { User } from 'src/common/user.decorator';

@Controller('users/me/notifications')
@ApiUseTags('Users')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {

  constructor(
    private notificationService: NotificationsService,
    private userNotifications: UserNotificationsService,
  ) {
  }

  @Get()
  @ApiOperation({ title: 'Get User Notifications' })
  @ApiOkResponse({ type: NotificationVm, isArray: true })
  @Output([NotificationVm])
  list(@User() user: IUser, @Query() q: { page: number }) {
    return this.notificationService.getForUser(String(user._id), q.page);
  }

  @Put('settings')
  @ApiOperation({ title: 'Update user notification settings' })
  @Output(NotificationSettingsVm)
  async updateSettings(@User() user: IUser, @Body() settings: UpdateNotificationSettingsDto) {
    return this.userNotifications.updateSettings(user, settings as INotificationSettings);
  }

  @Post('subscribe')
  @ApiOperation({
    title: 'Create New Push Subscription',
    description: 'Add browser push subscription to user',
  })
  async createPushSubscription(@User() user: IUser, @Body() push: CreatePushSubscriptionDto) {
    await this.userNotifications.addPushSubscription(user, push);
  }

  @Put('read')
  @ApiOperation({ title: 'Mark Notification as read' })
  @Output([NotificationVm])
  async markRead(@User() user: IUser, @Body() data: MarkNotificationsReadDto) {
    return this.notificationService.markRead(data, String(user._id));
  }

}
