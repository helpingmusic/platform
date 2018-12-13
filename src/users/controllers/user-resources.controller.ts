import { Controller, Get, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { BookingService } from 'src/api/booking/booking.service';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { IUser } from 'src/users/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import { UserResourceGuard } from 'src/users/controllers/user-resource.guard';

@UseGuards(UserResourceGuard)
@Controller('users/:userId')
export class UserResourcesController {

  constructor(
    // private readonly bookingService: BookingService,
    // private notificationService: NotificationsService,
  ) {
  }

  // @Get('notifications')
  // getNotifications(@User() user: IUser, @Param('userId') userId: string) {
  //   const id = userId === 'me' ? user._id : userId;
  //   if (userId === 'me' && user.role !== UserRoles.ADMIN) {
  //     throw new UnauthorizedException();
  //   }
  //
  //   return this.notificationService.getForUser(id);
  // }

}
