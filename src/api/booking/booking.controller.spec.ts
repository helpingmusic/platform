import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from 'src/api/booking/booking.service';
import { BookingController } from './booking.controller';

describe('Booking Controller', () => {
  let module: TestingModule;
  const bookingServiceMock = {};
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [BookingController],
    })
      .overrideProvider(BookingService).useValue(bookingServiceMock)
      .compile();
  });
  it('should be defined', () => {
    const controller: BookingController = module.get<BookingController>(BookingController);
    expect(controller).toBeDefined();
  });
});
