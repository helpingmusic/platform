import { ICommand } from '@nestjs/cqrs';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';

export class RefundUserBookingCommand implements ICommand {
  constructor(public booking: IBooking) {
  }
}