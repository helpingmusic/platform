import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { BookingStatus } from 'src/api/booking/booking-status.enum';
import { BookingCancelledEvent } from 'src/api/booking/events/booking-cancelled.event';
import { BookingCreatedEvent } from 'src/api/booking/events/booking-created.event';
import { BookingRemovedEvent } from 'src/api/booking/events/booking-removed.event';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';
import { BookingSchema } from 'src/api/booking/schemas/booking.schema';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class BookingEventsModel extends SchemaEventModel<IBooking> {
  constructor(protected events$: EventBus) {
    super(BookingSchema, events$);

    BookingSchema.pre('save', async function() {
      const doc = this as IBooking & { _cancelled: boolean };

      if (this.isModified('status') && doc.status === BookingStatus.CANCELLED) {
        doc._cancelled = true;
      }
    });

    BookingSchema.post('save', (doc: any) => {
      if (doc._cancelled) {
        this.cancelled(doc);
      }
    });

  }

  created(a: IBooking) {
    this.events$.publish(
      new BookingCreatedEvent(a),
    );
  }

  saved(a: IBooking, changes: IModelChanges) {
  }

  removed(a: IBooking) {
    this.events$.publish(
      new BookingRemovedEvent(a),
    );
  }

  cancelled(doc: IBooking) {
    this.events$.publish(new BookingCancelledEvent(doc));
  }
}
