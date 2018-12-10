import { Injectable } from '@nestjs/common';
import { Bookables } from 'src/api/bookable/bookables';
import { IBookable } from 'src/api/bookable/bookable.interface';
import { CalendarService } from 'src/api/bookable/calendar.service';
import { MembershipPlans } from 'src/common/constants';
import { moment } from 'src/common/vendor';

@Injectable()
export class BookableService {

  bookables = Bookables;

  constructor(
    private calendar: CalendarService,
  ) {
  }

  async index(): Promise<Array<IBookable>> {
    return this.bookables;
  }

  findById(id: string): IBookable | null {
    return this.bookables.find(b => b._id === id);
  }

  findByName(name: string): IBookable | null {
    return this.bookables.find(b => b.id === name);
  }

  /**
   * Check if time for bookable is available for a user on a given tier
   * @param bookableId
   * @param tier
   * @param start
   * @param end
   */
  userCanBookTime(bookableId: string, tier: MembershipPlans, start: Date, end: Date): boolean {
    const b = this.findById(bookableId);
    const s = moment(start);
    const e = moment(end);

    const startDay = s.format('dddd').toLowerCase();
    const endDay = e.format('dddd').toLowerCase();

    const startHour = +s.format('H');
    const endHour = +e.format('H');

    const hours = b.hours[tier][startDay];

    const startingTimeRange = hours.find(tr => tr.start <= startHour);
    if (!startingTimeRange) return false;

    if (endDay === startDay) {
      return startingTimeRange.end >= endHour;
    }

    // If end is 24, it rolls over to next day
    if (startingTimeRange.end !== 24) return false;

    const endingTimeRange = b.hours[tier][endDay][0];
    return endingTimeRange.start === 0 && endingTimeRange.end >= endHour;
  }

  async timeSlotIsOpen(bookableId: string, start: Date, end: Date): Promise<boolean> {
    const b = this.findById(bookableId);
    return this.calendar.checkFreeBusy(b.calendars, start, end);
  }

  getRateForPlan(bookableId: string, plan: MembershipPlans): number {
    const b = this.findById(bookableId);
    const rate = b.rates[plan];
    if (!rate) {
      throw new Error(`No rate for plan "${plan}" for bookable "${bookableId}"`);
    }
    return rate;
  }

}
