import { ICommand } from '@nestjs/cqrs';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';

export class AddBookingToCalendarCommand implements ICommand {
  constructor(
    public booking: IBooking,
  ) {
  }
}