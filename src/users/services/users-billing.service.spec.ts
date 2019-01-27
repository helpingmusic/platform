import { Test, TestingModule } from '@nestjs/testing';
import { CreditTransactionService } from 'src/api/credit-transaction/credit-transaction.service';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { UsersBillingService } from './users-billing.service';

describe('UsersBillingService', () => {
  let service: UsersBillingService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [UsersBillingService],
    })
      .overrideProvider(CreditTransactionService).useValue({})
      .compile();
    service = module.get<UsersBillingService>(UsersBillingService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
