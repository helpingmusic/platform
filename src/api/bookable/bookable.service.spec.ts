import { Test, TestingModule } from '@nestjs/testing';
import { Bookables } from 'src/api/bookable/bookables';
import { CalendarService } from 'src/api/bookable/calendar.service';
import { MembershipPlans } from 'src/common/constants';
import { moment } from 'src/common/vendor';
import { BookableService } from './bookable.service';

describe('BookableService', () => {
  let service: BookableService;

  const calendarMock = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookableService],
    })
      .overrideProvider(CalendarService)
      .useValue(calendarMock)
      .compile();

    service = module.get<BookableService>(BookableService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#userCanBookTime', () => {
    const bookable = Bookables[0];

    describe('When checking against business hours', () => {
      const tier = MembershipPlans.COMMUNITY_1;
      const cases = [
        { start: '9am', end: '12pm', allow: true },
        { start: '1am', end: '6am', allow: false },
        { start: '6am', end: '10am', allow: false },
        { start: '4pm', end: '8pm', allow: false },
        { start: '10pm', end: '3am', allow: false },
      ];

      cases.forEach(({ start, end, allow }) => {
        it(`should ${!allow && 'not'} allow ${start} - ${end}`, () => {
          const s = moment(start, ['ha']).day(3);
          const e = moment(end, ['ha']).day(3);
          if (e.isBefore(s)) e.add(1, 'day');
          expect(service.userCanBookTime(bookable._id, tier, s, e)).toBe(allow);
        });
      });
    });

    describe('When checking against 24/7 hours', () => {
      const tier = MembershipPlans.PRODUCTION_1;
      const cases = [
        { start: '9am', end: '12pm', allow: true },
        { start: '1am', end: '6am', allow: true },
        { start: '6am', end: '10am', allow: true },
        { start: '4pm', end: '8pm', allow: true },
        { start: '10pm', end: '3am', allow: true },
      ];

      cases.forEach(({ start, end, allow }) => {
        it(`should ${!allow && 'not'} allow ${start} - ${end}`, () => {
          const s = moment(start, ['ha']).day(3);
          const e = moment(end, ['ha']).day(3);
          if (e.isBefore(s)) e.add(1, 'day');
          expect(service.userCanBookTime(bookable._id, tier, s, e)).toBe(allow);
        });
      });
    });

  });

});
