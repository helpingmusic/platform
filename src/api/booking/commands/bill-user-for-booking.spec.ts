import { Test } from '@nestjs/testing';
import { BookableService } from 'src/api/bookable/bookable.service';
import { Bookables } from 'src/api/bookable/bookables';
import { BookingStatus } from 'src/api/booking/booking-status.enum';
import { BookingService } from 'src/api/booking/booking.service';
import { BillUserForBookingCommand } from 'src/api/booking/commands/bill-user-for-booking.command';
import { BillUserForBookingHandler } from 'src/api/booking/commands/bill-user-for-booking.handler';
import { MembershipPlans } from 'src/common/constants';
import { UsersBillingService } from 'src/users/services/users-billing.service';
import { UsersService } from 'src/users/services/users.service';
import { CommandResult } from 'src/common/abstract/command-result';

describe('BillUserForBookingHandler', () => {
  const bookableRate = 4000;
  const userId = '1';
  const invoice = {
    id: '1',
    lines: {
      data: [{ id: '3' }],
    },
  };
  const booking: any = {
    bookable: Bookables[0].id,
    booker: '1',
    time: { start: new Date(), end: new Date() },
    duration: 3,
    status: BookingStatus.BOOKED,
    update: jest.fn().mockReturnValue(Promise.resolve()),
  };

  const userService = { getById: jest.fn().mockReturnValue(Promise.resolve({ stripe: { plan: MembershipPlans.PRODUCTION_1 } })) };
  const bookingService = { update: jest.fn().mockImplementation(async (a, b) => ({ ...a, ...b })) };
  const bookableService = {
    findById: jest.fn().mockReturnValue(Bookables[0]),
    getRateForPlan: jest.fn().mockReturnValue(bookableRate),
  };
  const userBillingMock = {
    charge: jest.fn().mockImplementation((u, items) => {
      const amount_due = items.reduce((sum, i) => sum + i.amount, 0);
      return { ...invoice, amount_due };
    }),
  };
  const resolveMock = jest.fn();
  const clearMocks = () => {
    bookingService.update.mockClear();
    bookableService.findById.mockClear();
    bookableService.getRateForPlan.mockClear();
    userService.getById.mockClear();
    userBillingMock.charge.mockClear();
    resolveMock.mockClear();
  };

  let handler: BillUserForBookingHandler;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [BillUserForBookingHandler],
    })
      .overrideProvider(UsersBillingService).useValue(userBillingMock)
      .overrideProvider(BookableService).useValue(bookableService)
      .overrideProvider(BookingService).useValue(bookingService)
      .overrideProvider(UsersService).useValue(userService)
      .compile();

    handler = module.get<BillUserForBookingHandler>(BillUserForBookingHandler);
  });

  it('should be truthy', function() {
    expect(handler).toBeTruthy();
  });

  describe('When running validly', () => {
    beforeAll(async () => {
      const cmd = new BillUserForBookingCommand(userId, booking);
      await handler.execute(cmd, resolveMock);
    });
    afterAll(() => clearMocks());

    it('should resolve execution', async () => {
      const res: CommandResult = resolveMock.mock.calls[0][0];
      expect(res).toBeTruthy();
      expect(res.successful).toBe(true);
      expect(res.data).toBeTruthy();
    });

    it('should charge user', function() {
      expect(userBillingMock.charge).toHaveBeenCalledTimes(1);
      const amount = userBillingMock.charge.mock.calls[0][1][0].amount;
      expect(amount).toBe(booking.duration * bookableRate);
    });

    it('should update the booking with invoice information', function() {
      const invoiceAmount = userBillingMock.charge.mock.calls[0][1][0].amount;
      expect(bookingService.update).toHaveBeenCalledWith(booking, {
        invoiceId: invoice.id,
        invoiceItemId: invoice.lines.data[0].id,
        invoiceAmount,
      });
    });
  });

  describe('When payment fails', () => {
    beforeAll(async () => {
      userBillingMock.charge.mockImplementationOnce(() => Promise.reject(new Error('Bad card')));
      const cmd = new BillUserForBookingCommand(userId, booking);
      await handler.execute(cmd, resolveMock);
    });
    afterAll(() => clearMocks());

    it('should resolve execution with error', async () => {
      const res: CommandResult = resolveMock.mock.calls[0][0];
      expect(res).toBeTruthy();
      expect(res.successful).toBe(false);
      expect(res.error).toBeTruthy();
    });

    it('should not update the booking', function() {
      expect(bookingService.update).toHaveBeenCalledTimes(0);
    });
  });

});