import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from 'src/api/booking/booking.service';
import { UserResourcesController } from './user-resources.controller';

describe('UserResources Controller', () => {
  let module: TestingModule;

  const bookingServiceMock = { getForUser: jest.fn().mockResolvedValue([]) };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserResourcesController],
    })
      .overrideProvider(BookingService).useValue(bookingServiceMock)
      .compile();
  });
  it('should be defined', () => {
    const controller: UserResourcesController = module.get<UserResourcesController>(UserResourcesController);
    expect(controller).toBeDefined();
  });
});
