import { Schema } from 'mongoose';
import { BookingStatus } from 'src/api/booking/booking-status.enum';
import { sessions } from 'src/common/constants';
import { moment } from 'src/common/vendor';

export const BookingSchema = new Schema({

  booker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  bookable: {
    type: String,
    required: true,
  },

  time: {
    type: new Schema({
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    }),
    default: {},
    required: true,
    validate: {
      async validator(time) {
        if (!this.isNew) return true;

        // Check duration
        if (this.duration < sessions.minDuration) {
          throw new Error(`Session must be at least ${sessions.minDuration} hours long.`);
        }
        if (this.duration > sessions.maxDuration) {
          throw new Error(`Session must be no longer than ${sessions.maxDuration} hours.`);
        }

        return true;
      },
      message: 'Time slot is not available.',
    },
  },

  invoiceAmount: Number,

  invoiceId: String,
  invoiceItemId: String,
  // Stripe refund if user cancels booking
  refundId: String,

  status: {
    type: String,
    enum: { values: Object.keys(BookingStatus).map(k => BookingStatus[k]) },
    default: BookingStatus.BOOKED,
  },

  // google calendar event ids
  eventIds: {
    type: [{
      gcalId: String,
      event: String,
    }],
  },

}, {

  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

function roundTimeToNearestBookingIncrement(time) {
  const inc = Math.round(sessions.increment * 60);
  const m = moment(time._isAMomentObject ? time.toDate() : time).startOf('minute');
  const diff = m.minutes() % inc;

  if (diff > (inc / 2)) {
    m.add((inc - diff), 'minutes');
  } else {
    m.subtract(diff, 'minutes');
  }

  return m.toDate();
}

BookingSchema.virtual('start')
  .get(function() {
    return this.time.start;
  })
  .set(function(start) {
    this.time.start = roundTimeToNearestBookingIncrement(start);
  });

BookingSchema.virtual('end')
  .get(function() {
    return this.time.end;
  })
  .set(function(end) {
    this.time.end = roundTimeToNearestBookingIncrement(end);
  });

BookingSchema.virtual('duration')
  .get(function() {
    const duration = moment.duration(moment(this.end).diff(moment(this.start)));
    return duration.asHours();
  });
