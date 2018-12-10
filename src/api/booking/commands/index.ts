import { AddBookingToCalendarHandler } from 'src/api/booking/commands/add-booking-to-calendar.handler';
import { BillUserForBookingHandler } from 'src/api/booking/commands/bill-user-for-booking.handler';
import { RefundUserBookingHandler } from 'src/api/booking/commands/refund-user-booking.handler';
import { RemoveBookingFromCalendarHandler } from 'src/api/booking/commands/remove-booking-from-calendar.handler';

export const CommandHandlers = [
  AddBookingToCalendarHandler,
  BillUserForBookingHandler,
  RefundUserBookingHandler,
  RemoveBookingFromCalendarHandler,
];