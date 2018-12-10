import { IEvent } from '@nestjs/cqrs';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';

export class BookingRemovedEvent implements IEvent {
  constructor(
    public booking: IBooking,
  ) {
  }
}