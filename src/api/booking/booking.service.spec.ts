import { CommandBus, CQRSModule } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BookableService } from 'src/api/bookable/bookable.service';
import { Bookables } from 'src/api/bookable/bookables';
import { BillUserForBookingCommand } from 'src/api/booking/commands/bill-user-for-booking.command';
import { CreateBookingDto } from 'src/api/booking/dto/create-booking.dto';
import { MembershipPlans } from 'src/common/constants';
import { BadDataException } from 'src/common/exceptions/bad-data.exception';
import { UsersService } from 'src/users/services/users.service';
import { CommandResult } from 'src/common/abstract/command-result';
import { moment } from 'src/common/vendor';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;
  let cmdBus: CommandBus;
  const testBookable = Bookables[0];

  const modelMock = {
    create: jest.fn().mockImplementation(v => Promise.resolve(v)),
  };

  const userService = {
    getById: jest.fn().mockImplementation(async () => ({
      stripe: { plan: MembershipPlans.PRODUCTION_1 },
    })),
  };

  const bookableService = {
    findById: jest.fn().mockImplementation(id => {
      if (testBookable.id === id) return testBookable;
      return null;
    }),
    userCanBookTime: jest.fn().mockImplementation(() => true),
    timeSlotIsOpen: jest.fn().mockImplementation(() => Promise.resolve(true)),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CQRSModule],
      providers: [
        BookingService,
        { provide: getModelToken('Booking'), useValue: modelMock },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .overrideProvider(BookableService)
      .useValue(bookableService)
      .compile();

    service = module.get<BookingService>(BookingService);
    cmdBus = module.get<CommandBus>(CommandBus);

  });

  beforeEach(() => {
    jest.spyOn(cmdBus, 'execute').mockImplementation(async () => new CommandResult(true, {}));
    bookableService.findById.mockClear();
    bookableService.timeSlotIsOpen.mockClear();
    bookableService.userCanBookTime.mockClear();
    modelMock.create.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#create', () => {
    const userId = '1';
    const bookable = Bookables[0];
    const data: CreateBookingDto = {
      start: moment().hour(10).minute(0).second(0).toDate(),
      duration: 3,
      booker: userId,
      bookable: bookable.id,
    };

    describe('When passing valid data', () => {
      it('should create booking', async () => {
        const booking = await service.create(data);
        expect(booking.bookable).toBe(data.bookable);
        expect(modelMock.create).toHaveBeenCalledTimes(1);
      });
      it('should charge user', async () => {
        const booking = await service.create(data);
        expect(cmdBus.execute).toHaveBeenCalledWith(new BillUserForBookingCommand(data.booker, booking));
      });
    });

    describe('When bookable is not found', () => {
      beforeEach(() => {
        bookableService.findById.mockImplementationOnce(() => null);
      });
      it('should throw BadDataException', async () => {
        const err: BadDataException = await service.create(data).catch(e => e);
        expect(err).toBeInstanceOf(BadDataException);
        expect(err.message.message).toHaveProperty('field', 'bookable');
      });
      it('should not create booking', async () => {
        await expect(service.create(data)).rejects.toThrow();
        expect(modelMock.create).toHaveBeenCalledTimes(0);
      });
    });

    describe('When user cannot book time', () => {
      beforeEach(() => {
        bookableService.userCanBookTime.mockImplementationOnce(() => false);
      });
      it('should throw BadDataException', async () => {
        const err = await service.create(data).catch(e => e);
        expect(err).toBeInstanceOf(BadDataException);
        expect(err.message.message).toHaveProperty('field', 'startTime');
      });
      it('should not create booking', async () => {
        await expect(service.create(data)).rejects.toThrow();
        expect(modelMock.create).toHaveBeenCalledTimes(0);
      });
    });

    describe('When time slot is not open', () => {
      beforeEach(() => {
        bookableService.timeSlotIsOpen.mockImplementationOnce(async () => false);
      });
      it('should throw BadDataException', async () => {
        const err = await service.create(data).catch(e => e);
        expect(err).toBeInstanceOf(BadDataException);
        expect(err.message.message).toHaveProperty('field', 'startTime');
      });
      it('should not create booking', async () => {
        await expect(service.create(data)).rejects.toThrow();
        expect(modelMock.create).toHaveBeenCalledTimes(0);
      });
    });

    describe('When user payment fails', () => {
      beforeEach(() => {
        jest.spyOn(service, 'remove').mockClear();
        jest.spyOn(cmdBus, 'execute').mockImplementationOnce(async () => new CommandResult(false, {}));
        jest.spyOn(service, 'remove').mockImplementation(async () => {
        });
      });

      it('should throw BadDataException', async () => {
        const err = await service.create(data).catch(e => e);
        expect(err).toBeInstanceOf(BadDataException);
        expect(err.message.message).toHaveProperty('field', 'payment');
      });
      it('should remove created booking', async () => {
        await expect(service.create(data)).rejects.toThrow();
        expect(modelMock.create).toHaveBeenCalledTimes(1);
        expect(service.remove).toHaveBeenCalledTimes(1);
      });
    });

  });

});
