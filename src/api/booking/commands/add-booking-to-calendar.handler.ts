import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BookableService } from 'src/api/bookable/bookable.service';
import { CalendarService } from 'src/api/bookable/calendar.service';
import { BookingService } from 'src/api/booking/booking.service';
import { AddBookingToCalendarCommand } from 'src/api/booking/commands/add-booking-to-calendar.command';
import { UsersService } from 'src/users/services/users.service';
import { moment } from 'src/common/vendor';

@CommandHandler(AddBookingToCalendarCommand)
export class AddBookingToCalendarHandler implements ICommandHandler<AddBookingToCalendarCommand> {

  constructor(
    private calendar: CalendarService,
    private bookableService: BookableService,
    private userService: UsersService,
    private bookingService: BookingService,
  ) {
  }

  async execute(cmd: AddBookingToCalendarCommand, resolve: (value?) => void) {
    const { booking } = cmd;

    const bookable = this.bookableService.findById(booking.bookable);
    const booker = await this.userService.getById(booking.booker);

    const start = moment(booking.time.start).format();
    const end = moment(booking.time.end).format();

    const eventIds  = await this.calendar.addEvents(bookable.calendars, {
      start,
      end,
      summary: `${booker.first_name} ${booker.last_name} Session`,
      status: booking.status,
    });

    await this.bookingService.update(booking, { eventIds });

    resolve();
  }
}
