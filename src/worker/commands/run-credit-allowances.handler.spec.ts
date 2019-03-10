import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';
import { moment } from 'src/common/vendor';
import { AllowanceStatuses } from 'src/api/credit-transaction/allowance-statuses.enum';
import { CreditTransactionService } from 'src/api/credit-transaction/credit-transaction.service';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { RunCreditAllowancesCommand } from 'src/worker/commands/run-credit-allowances.command';
import { RunCreditAllowancesHandler } from 'src/worker/commands/run-credit-allowances.handler';

describe('RunCreditAllowancesHandler', () => {

  let module: TestingModule;
  let handler: RunCreditAllowancesHandler;

  const transactionMock = {
    find: jest.fn().mockResolvedValue([]),
    findPendingAllowances: jest.fn().mockResolvedValue([]),
    findLastAllowanceForUser: jest.fn(),
    create: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        RunCreditAllowancesHandler,
        {
          provide: CreditTransactionService,
          useValue: transactionMock,
        },
      ],
    })
      .compile();

    handler = module.get<RunCreditAllowancesHandler>(RunCreditAllowancesHandler);
  });

  it('should be defined', async () => {
    expect(handler).toBeDefined();
  });

  describe('When no allowances to run', () => {
    const resolveMock = jest.fn();

    beforeAll(async () => {
      const cmd = new RunCreditAllowancesCommand();
      await handler.execute(cmd, resolveMock);
    });

    it('should resolve', async () => {
      expect(resolveMock).toHaveBeenCalled();
    });
    it('should not not find allowances for user', async () => {
      expect(transactionMock.findLastAllowanceForUser).toHaveBeenCalledTimes(0);
    });
  });

  describe(`When running user's first allowance`, () => {
    const resolveMock = jest.fn();
    const pendingAllowance = {
      user: { _id: '123', credits: 0 },
      amount: 1000,
      set: jest.fn(),
      save: jest.fn(),
    };

    beforeAll(async () => {
      transactionMock.findPendingAllowances.mockResolvedValueOnce([pendingAllowance]);

      const cmd = new RunCreditAllowancesCommand();
      await handler.execute(cmd, resolveMock);
    });

    it('should create transaction for allowance', async () => {
      expect(transactionMock.create).toHaveBeenCalledWith({
        user: pendingAllowance.user._id,
        startAmount: pendingAllowance.user.credits,
        endAmount: pendingAllowance.user.credits + pendingAllowance.amount,
        type: TransactionTypes.MONTHLY_ALLOWANCE,
      });
    });

    it('should mark allowance as used', async () => {
      expect(pendingAllowance.set).toHaveBeenCalledWith({ status: 'used' });
      expect(pendingAllowance.save).toHaveBeenCalledTimes(1);
    });

  });

  describe(`When running a user's second allowance with no leftover credits`, () => {
    const resolveMock = jest.fn();
    const pendingAllowance = {
      user: { _id: '123', credits: 0 },
      amount: 1000,
      set: jest.fn(),
      save: jest.fn(),
    };
    const pastAllowance = {
      created_at: moment().subtract(10, 'days').toDate(),
    };
    const creditRedeem = {
      amount: -1000,
    };

    beforeAll(async () => {
      transactionMock.findPendingAllowances.mockResolvedValueOnce([pendingAllowance]);
      transactionMock.findLastAllowanceForUser.mockResolvedValueOnce(pastAllowance);
      transactionMock.find.mockResolvedValueOnce([creditRedeem]);

      const cmd = new RunCreditAllowancesCommand();
      await handler.execute(cmd, resolveMock);
    });

    it('should create transaction for full allowance', async () => {
      expect(transactionMock.create).toHaveBeenCalledWith({
        user: pendingAllowance.user._id,
        startAmount: pendingAllowance.user.credits,
        endAmount: pendingAllowance.user.credits + pendingAllowance.amount,
        type: TransactionTypes.MONTHLY_ALLOWANCE,
      });
    });
  });

  describe(`When running a user's second allowance with leftover credits`, () => {
    const resolveMock = jest.fn();
    const pendingAllowance = {
      user: { _id: '123', credits: 500 },
      amount: 1000,
      set: jest.fn(),
      save: jest.fn(),
    };
    const pastAllowance = {
      created_at: moment().subtract(10, 'days').toDate(),
    };
    const creditRedeem = {
      amount: -500,
    };

    beforeAll(async () => {
      transactionMock.findPendingAllowances.mockResolvedValueOnce([pendingAllowance]);
      transactionMock.findLastAllowanceForUser.mockResolvedValueOnce(pastAllowance);
      transactionMock.find.mockResolvedValueOnce([creditRedeem]);

      const cmd = new RunCreditAllowancesCommand();
      await handler.execute(cmd, resolveMock);
    });

    it('should not rollover credits', async () => {
      expect(transactionMock.create).toHaveBeenCalledWith({
        user: pendingAllowance.user._id,
        startAmount: pendingAllowance.user.credits,
        endAmount: pendingAllowance.user.credits + 500,
        type: TransactionTypes.MONTHLY_ALLOWANCE,
      });
    });
  });

  describe(`When running a user's second allowance with credits unused`, () => {
    const resolveMock = jest.fn();
    const pendingAllowance = {
      user: { _id: '123', credits: 500 },
      amount: 1000,
      set: jest.fn(),
      save: jest.fn(),
    };
    const pastAllowance = {
      created_at: moment().subtract(10, 'days').toDate(),
    };

    beforeAll(async () => {
      transactionMock.findPendingAllowances.mockResolvedValueOnce([pendingAllowance]);
      transactionMock.findLastAllowanceForUser.mockResolvedValueOnce(pastAllowance);
      transactionMock.find.mockResolvedValueOnce([]);

      const cmd = new RunCreditAllowancesCommand();
      await handler.execute(cmd, resolveMock);
    });

    it('should not award credits', async () => {
      expect(transactionMock.create).toHaveBeenCalledWith({
        user: pendingAllowance.user._id,
        startAmount: pendingAllowance.user.credits,
        endAmount: pendingAllowance.user.credits,
        type: TransactionTypes.MONTHLY_ALLOWANCE,
      });
    });
  });

});