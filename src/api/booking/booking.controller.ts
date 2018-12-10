import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiUnprocessableEntityResponse, ApiUseTags } from '@nestjs/swagger';
import { BookingService } from 'src/api/booking/booking.service';
import { CreateBookingDto } from 'src/api/booking/dto/create-booking.dto';
import { BookingVm } from 'src/api/booking/vm/booking.vm';
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { IUser } from 'src/users/interfaces/user.interface';
import { Output } from 'src/common/output.decorator';
import { User } from 'src/common/user.decorator';

@ApiUseTags('Bookings')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard)
@Controller('bookings')
export class BookingController {

  constructor(
    private bookingService: BookingService,
  ) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'Get Bookings for a user', description: 'Takes the current user\'s id to fetch bookings.' })
  @ApiOkResponse({ isArray: true, type: BookingVm })
  @Get()
  @Output([BookingVm])
  async index(@User() u: IUser, @Query() q: { booker: string }) {
    if (q.booker !== String(u._id) && u.role !== UserRoles.ADMIN) {
      throw new UnauthorizedException();
    }
    return this.bookingService.getForUser(q.booker);
  }

  /**
   * Create Booking
   */
  @ApiOperation({ title: 'Create a Booking' })
  @ApiOkResponse({ type: BookingVm })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @Post()
  @Output(BookingVm)
  async createBooking(@User() user, @Body() body: CreateBookingDto) {
    body.booker = user._id;
    return this.bookingService.create(body);
  }

  /**
   * Cancel Booking
   */
  @ApiOperation({ title: 'Cancel a Booking' })
  @ApiOkResponse({ type: BookingVm })
  @ApiNotFoundResponse({ description: 'Booking Not Found' })
  @Post(':id/cancel')
  @Output(BookingVm)
  cancelBooking(@Param('id') id: string) {
    return this.bookingService.cancel(id);
  }

}
