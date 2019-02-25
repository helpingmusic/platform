import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreditTransactionService } from 'src/api/credit-transaction/credit-transaction.service';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';
import { moment } from 'src/common/vendor';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { RunCreditAllowancesCommand } from 'src/worker/commands/run-credit-allowances.command';

@CommandHandler(RunCreditAllowancesCommand)
export class RunCreditAllowancesHandler implements ICommandHandler<RunCreditAllowancesCommand> {
  log: ILogger;

  constructor(
    private transactionService: CreditTransactionService,
    log: LogService,
  ) {
    this.log = log.createLogger('RunCreditAllowancesHandler');
  }

  async execute(cmd: RunCreditAllowancesCommand, resolve: (value?) => void) {
    let allowances;
    try {
      allowances = await this.transactionService.findPendingAllowances();
    } catch (err) {
      this.log.error(err);
      return resolve();
    }

    this.log.info('pending allowances ' + allowances.length);

    await Promise.all(allowances.map(async (at) => {

      const u = at.user as IUser;
      const lastAllowance = await this.transactionService.findLastAllowanceForUser(String(u._id));
      let applyToNextMonth = at.amount;

      this.log.info(`user ${u._id}; allowance ${at._id}`);
      if (lastAllowance) {
        const transactions = await this.transactionService.find({
          user: at.user,
          type: TransactionTypes.CREDIT_REDEEM,
          created_at: {
            $gte: lastAllowance ? moment(lastAllowance.created_at).toDate() : 0,
          },
        });

        const used = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        applyToNextMonth = used > at.amount ? at.amount : used;
      }

      try {
        const newTransaction = await this.transactionService.create({
          user: u._id,
          startAmount: u.credits,
          endAmount: u.credits + applyToNextMonth,
          type: TransactionTypes.MONTHLY_ALLOWANCE,
        });

        this.log.info(newTransaction.toObject());
      } catch (e) {
        this.log.error(e);
      }

      at.set({ status: 'used' });
      return at.save();
    }))
      .catch(err => {
        this.log.error(err);
      });

    resolve();

  }
}