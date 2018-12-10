import { ICommand } from '@nestjs/cqrs';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';

export class BillUserForBookingCommand implements ICommand {
  constructor(
    public userId: string,
    public booking: IBooking,
  ) {
  }
}