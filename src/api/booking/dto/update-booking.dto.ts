import { BookingStatus } from 'src/api/booking/booking-status.enum';

export class UpdateBookingDto {

  status?: BookingStatus;

  invoiceAmount?: number;
  invoiceId?: string;
  invoiceItemId?: string;

  refundId?: string;
  eventIds?: Array<{
    gcalId: string;
    event: string;
  }>;

}
