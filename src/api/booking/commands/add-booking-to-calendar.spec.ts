import { Test } from '@nestjs/testing';
import { BookableService } from 'src/api/bookable/bookable.service';
import { Bookables } from 'src/api/bookable/bookables';
import { CalendarService } from 'src/api/bookable/calendar.service';
import { BookingStatus } from 'src/api/booking/booking-status.enum';
import { AddBookingToCalendarCommand } from 'src/api/booking/commands/add-booking-to-calendar.command';
import { AddBookingToCalendarHandler } from 'src/api/booking/commands/add-booking-to-calendar.handler';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';
import { UsersService } from 'src/users/services/users.service';

describe('AddBookingToCalendarCommand', () => {

  const calendarMock = {
    addEvents: jest.fn().mockImplementation(async () => {
    }),
  };
  const bookableService = { findById: jest.fn().mockReturnValue(Bookables[0]) };
  const userService = { getById: jest.fn().mockReturnValue(Promise.resolve({})) };
  const resolveMock = jest.fn();

  const booking = {
    bookable: Bookables[0].id,
    booker: '1',
    time: { start: new Date(), end: new Date() },
    status: BookingStatus.BOOKED,
  };

  let handler: AddBookingToCalendarHandler;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [AddBookingToCalendarHandler],
    })
      .overrideProvider(CalendarService)
      .useValue(calendarMock)
      .overrideProvider(BookableService)
      .useValue(bookableService)
      .overrideProvider(UsersService)
      .useValue(userService)
      .compile();

    handler = module.get<AddBookingToCalendarHandler>(AddBookingToCalendarHandler);
  });

  beforeEach(() => {
    calendarMock.addEvents.mockClear();
    bookableService.findById.mockClear();
    userService.getById.mockClear();
    resolveMock.mockClear();
  });

  it('should resolve execution', async () => {
    const cmd = new AddBookingToCalendarCommand(booking as IBooking);
    const res = await handler.execute(cmd, resolveMock);
    expect(resolveMock).toHaveBeenCalledTimes(1);
  });

  it('should add events to calendar', async function() {
    const cmd = new AddBookingToCalendarCommand(booking as IBooking);
    const res = await handler.execute(cmd, resolveMock);
    expect(calendarMock.addEvents).toHaveBeenCalledTimes(1);
  });

});