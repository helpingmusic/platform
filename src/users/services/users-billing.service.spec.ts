import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { UsersBillingService } from './users-billing.service';

describe('UsersBillingService', () => {
  let service: UsersBillingService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [UsersBillingService],
    }).compile();
    service = module.get<UsersBillingService>(UsersBillingService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
