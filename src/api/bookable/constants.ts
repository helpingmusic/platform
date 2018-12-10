import { Expose } from 'class-transformer';

export const MIN_BOOKING_DURATION = 1;
export const MAX_BOOKING_DURATION = 12;
export const BOOKING_TIME_INCREMENT = 0.5; // half hour precision

export class TimeRange {
  @Expose()
  start: number;
  @Expose()
  end: number;
  constructor(s, e) {
    this.start = s;
    this.end = e;
  }
}

export const AvailabilityTypes = {
  // Only allow during business hours
  businessHours: {
    sunday: [new TimeRange(11, 23)],
    monday: [new TimeRange(9, 18)],
    tuesday: [new TimeRange(9, 18)],
    wednesday: [new TimeRange(9, 18)],
    thursday: [new TimeRange(9, 18)],
    friday: [new TimeRange(9, 18)],
    saturday: [new TimeRange(9, 19)],
  },
  // 24/7
  all: {
    sunday: [new TimeRange(0, 24)],
    monday: [new TimeRange(0, 24)],
    tuesday: [new TimeRange(0, 24)],
    wednesday: [new TimeRange(0, 24)],
    thursday: [new TimeRange(0, 24)],
    friday: [new TimeRange(0, 24)],
    saturday: [new TimeRange(0, 24)],
  },
};

