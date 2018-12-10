import { Document } from 'mongoose';
import { BookingStatus } from 'src/api/booking/booking-status.enum';

export interface IBooking extends Document {
  bookable: string;
  booker: string;

  time: {
    start: Date,
    end: Date,
  };
  start: Date;
  end: Date;

  duration: number;

  status: BookingStatus;

  invoiceAmount: number;
  invoiceId: string;
  invoiceItemId: string;

  refundId: string;
  eventIds: Array<{
    gcalId: string;
    event: string;
  }>;

  createdAt: Date;
}