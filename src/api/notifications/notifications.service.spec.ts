import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateModelMock } from 'fixtures/mocks/model.mock';
import { UserNotificationsService } from 'src/users/services/user-notifications.service';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const notificationModelMock = CreateModelMock('Notification');
  const userNotificationsServiceMock = {};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getModelToken('Notification'), useValue: notificationModelMock },
      ],
    })
      .overrideProvider(UserNotificationsService).useValue(userNotificationsServiceMock)
      .compile();
    service = module.get<NotificationsService>(NotificationsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
