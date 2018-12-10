import { Test, TestingModule } from '@nestjs/testing';
import { CreditTransactionService } from './credit-transaction.service';

describe('CreditTransactionService', () => {
  let service: CreditTransactionService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditTransactionService],
    }).compile();
    service = module.get<CreditTransactionService>(CreditTransactionService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
