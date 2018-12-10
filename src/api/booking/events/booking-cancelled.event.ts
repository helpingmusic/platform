import { IEvent } from '@nestjs/cqrs';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';

export class BookingCancelledEvent implements IEvent {
  constructor(
    public booking: IBooking,
  ) {
  }
}