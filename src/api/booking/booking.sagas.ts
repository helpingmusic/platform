import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddBookingToCalendarCommand } from 'src/api/booking/commands/add-booking-to-calendar.command';
import { RefundUserBookingCommand } from 'src/api/booking/commands/refund-user-booking.command';
import { RemoveBookingFromCalendarCommand } from 'src/api/booking/commands/remove-booking-from-calendar.command';
import { BookingCancelledEvent } from 'src/api/booking/events/booking-cancelled.event';
import { BookingCreatedEvent } from 'src/api/booking/events/booking-created.event';
import { BookingRemovedEvent } from 'src/api/booking/events/booking-removed.event';

@Injectable()
export class BookingSagas {

  // Add booking to calendar when created
  addBookingToCalendar = (events$: EventObservable<BookingCreatedEvent>) =>
    events$.ofType(BookingCreatedEvent)
      .pipe(map(event => new AddBookingToCalendarCommand(event.booking)))

  // When booking is cancelled/removed, delete event on google calendar
  removeBookingFromCalendar = (events$: EventObservable<BookingRemovedEvent | BookingCancelledEvent>) =>
    merge(
      events$.ofType(BookingRemovedEvent),
      events$.ofType(BookingCancelledEvent),
    )
      .pipe(map(event => new RemoveBookingFromCalendarCommand(event.booking.eventIds)))

  // when booking is cancelled, calc the % refund to give member
  refundBooking = (events$: EventObservable<BookingCancelledEvent>) =>
    events$.ofType(BookingCancelledEvent)
      .pipe(map(event => new RefundUserBookingCommand(event.booking)))

  sagas = [
    this.addBookingToCalendar,
    this.removeBookingFromCalendar,
    this.refundBooking,
  ];

}