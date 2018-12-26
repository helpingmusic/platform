import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TimeRange } from 'src/api/bookable/constants';
import { MembershipPlans as mp } from 'src/common/constants';

class Rates {
  @Expose()
  readonly [mp.PRO]: number;
  @Expose()
  readonly [mp.ONLINE]: number;
  @Expose()
  readonly [mp.COMMUNITY_1]: number;
  @Expose()
  readonly [mp.CREATIVE_1]: number;
  @Expose()
  readonly [mp.COWRITE_1]: number;
  @Expose()
  readonly [mp.COWORK_1]: number;
  @Expose()
  readonly [mp.PRODUCTION_1]: number;

  @Expose()
  'pro-mth-1': number;
  @Expose()
  'pro-mth-2': number;
  @Expose()
  'pro-yr-1': number;
  @Expose()
  'pro-yr-2': number;
}

class DayTimes {
  @Expose()
  @Type(() => TimeRange)
  sunday: Array<TimeRange>;
  @Expose()
  @Type(() => TimeRange)
  monday: Array<TimeRange>;
  @Expose()
  @Type(() => TimeRange)
  tuesday: Array<TimeRange>;
  @Expose()
  @Type(() => TimeRange)
  wednesday: Array<TimeRange>;
  @Expose()
  @Type(() => TimeRange)
  thursday: Array<TimeRange>;
  @Expose()
  @Type(() => TimeRange)
  friday: Array<TimeRange>;
  @Expose()
  @Type(() => TimeRange)
  saturday: Array<TimeRange>;
}

class Availability {
  @Expose()
  @Type(() => DayTimes)
  readonly [mp.PRO]: DayTimes;
  @Expose()
  @Type(() => DayTimes)
  readonly [mp.ONLINE]: DayTimes;
  @Expose()
  @Type(() => DayTimes)
  readonly [mp.COMMUNITY_1]: DayTimes;
  @Expose()
  @Type(() => DayTimes)
  readonly [mp.CREATIVE_1]: DayTimes;
  @Expose()
  @Type(() => DayTimes)
  readonly [mp.COWRITE_1]: DayTimes;
  @Expose()
  @Type(() => DayTimes)
  readonly [mp.COWORK_1]: DayTimes;
  @Expose()
  @Type(() => DayTimes)
  readonly [mp.PRODUCTION_1]: DayTimes;
}

export class BookableVm {

  @ApiModelProperty()
  @Expose()
  _id: string;

  @ApiModelProperty()
  @Expose()
  id: string;

  @ApiModelProperty()
  @Expose()
  name: string;

  @ApiModelProperty()
  @Expose()
  location: string;

  @ApiModelProperty()
  @Expose()
  description: string;

  @ApiModelProperty({ description: 'Calendars the bookable uses' })
  @Expose()
  calendars: Array<string>;

  @ApiModelProperty()
  @Expose()
  imageUrl: string;

  @ApiModelProperty({
    description: 'Booking rates for each membership plan',
  })
  @Expose()
  @Type(() => Rates)
  rates: Rates;

  @ApiModelProperty({
    description: 'Availability of room based off tier and day. ',
  })
  @Expose()
  @Type(() => Availability)
  hours: Availability;
}