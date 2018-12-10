import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreditTransactionService } from 'src/api/credit-transaction/credit-transaction.service';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';
import { moment } from 'src/common/vendor';
import { IUser } from 'src/users/interfaces/user.interface';
import { RunCreditAllowancesCommand } from 'src/worker/commands/run-credit-allowances.command';

@CommandHandler(RunCreditAllowancesCommand)
export class RunCreditAllowancesHandler implements ICommandHandler<RunCreditAllowancesCommand> {
  constructor(
    private transactionService: CreditTransactionService,
  ) {
  }

  async execute(cmd: RunCreditAllowancesCommand, resolve: (value?) => void) {

    const allowances = await this.transactionService.findPendingAllowances();

    return Promise.all(allowances.map(async (at) => {

      const u = at.user as IUser;
      const lastAllowance = await this.transactionService.findLastAllowanceForUser(String(u._id));
      let applyToNextMonth = at.amount;

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

      await this.transactionService.create({
        user: at.user,
        startAmount: u.credits,
        endAmount: u.credits + applyToNextMonth,
        type: TransactionTypes.MONTHLY_ALLOWANCE,
      });

      at.set({ status: 'used' });
      return at.save();

    }));

  }
}