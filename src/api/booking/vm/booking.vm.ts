import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { type } from 'os';
import { BookableVm } from 'src/api/bookable/bookable.vm';
import { TimeRange } from 'src/api/bookable/constants';
import { BookingStatus } from 'src/api/booking/booking-status.enum';
import { DocumentVm } from 'src/common/abstract/document.vm';

class DateTimeRange {
  @ApiModelProperty()
  @Expose()
  start: Date;
  @ApiModelProperty()
  @Expose()
  end: Date;
}

class GCalEvent {
  @ApiModelProperty()
  @Expose()
  gcalId: string;
  @ApiModelProperty()
  @Expose()
  event: string;
}

export class BookingVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  @Type(() => String)
  booker: string;

  @ApiModelProperty({
    description: 'The ID of the studio booked',
    type: BookableVm,
  })
  @Expose()
  bookable: BookableVm;

  @ApiModelProperty()
  @Expose()
  @Type(() => DateTimeRange)
  time: DateTimeRange;

  @ApiModelProperty()
  @Expose()
  invoiceAmount: number;

  @ApiModelProperty({ type: BookingStatus })
  @Expose()
  status: BookingStatus;

  @ApiModelProperty({ description: 'Google Calendar Event IDs' })
  @Expose()
  @Type(() => GCalEvent)
  eventIds: Array<GCalEvent>;

  @ApiModelProperty()
  @Expose()
  createdAt: Date;

}