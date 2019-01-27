import { Test, TestingModule } from '@nestjs/testing';
import { CreateModelMock } from 'fixtures/mocks/model.mock';
import { getModelToken } from '@nestjs/mongoose';
import { CreditTransactionService } from './credit-transaction.service';

describe('CreditTransactionService', () => {
  let service: CreditTransactionService;

  const CreditTransactionMock = CreateModelMock('CreditTransaction');
  const AllowanceTransactionMock = CreateModelMock('AllowanceTransaction');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditTransactionService,
        { provide: getModelToken('CreditTransaction'), useValue: CreditTransactionMock },
        { provide: getModelToken('AllowanceTransaction'), useValue: AllowanceTransactionMock },
      ],
    })
      .compile();
    service = module.get<CreditTransactionService>(CreditTransactionService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
