import { Test, TestingModule } from '@nestjs/testing';
import { UsersBillingService } from 'src/users/services/users-billing.service';
import { SubscriptionController } from './subscription.controller';

describe('Subscription Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SubscriptionController],
    })
      .overrideProvider(UsersBillingService).useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: SubscriptionController = module.get<SubscriptionController>(SubscriptionController);
    expect(controller).toBeDefined();
  });
});
