import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';

describe('Notification Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [NotificationController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: NotificationController = module.get<NotificationController>(NotificationController);
    expect(controller).toBeDefined();
  });
});
