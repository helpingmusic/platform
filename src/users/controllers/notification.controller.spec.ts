import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { UserNotificationsService } from 'src/users/services/user-notifications.service';
import { NotificationController } from './notification.controller';

describe('Notification Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [NotificationController],
    })
      .overrideProvider(UserNotificationsService).useValue({})
      .overrideProvider(NotificationsService).useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: NotificationController = module.get<NotificationController>(NotificationController);
    expect(controller).toBeDefined();
  });
});
