import { IEvent } from '@nestjs/cqrs';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';

export class BookingCreatedEvent implements IEvent {
  constructor(
    public booking: IBooking,
  ) {
  }
}