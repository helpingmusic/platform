import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { NotificationsController } from './notifications.controller';

describe('Notifications Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [NotificationsController],
    })
      .overrideProvider(NotificationsService).useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: NotificationsController = module.get<NotificationsController>(NotificationsController);
    expect(controller).toBeDefined();
  });
});
