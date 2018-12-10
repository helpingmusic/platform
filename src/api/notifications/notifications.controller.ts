import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { IUser } from 'src/users/interfaces/user.interface';
import { User } from 'src/common/user.decorator';

@Controller('notifications')
@ApiUseTags('Notifications')
@Controller('notifications')
export class NotificationsController {

  constructor(
    private notificationService: NotificationsService,
  ) {
  }

  @Post(':id/read')
  @ApiOperation({ title: 'Mark Notification as read' })
  list(@User() user: IUser, @Param('id') notificationId: string) {
    return this.notificationService.markRead({ notifications: [notificationId] }, user._id);
  }

}
