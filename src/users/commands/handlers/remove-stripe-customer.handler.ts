import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';
import { RemoveStripeCustomerCommand } from 'src/users/commands/impl/remove-stripe-customer.command';
import { stripe } from 'src/common/vendor';

@CommandHandler(RemoveStripeCustomerCommand)
export class RemoveStripeCustomerHandler implements ICommandHandler<RemoveStripeCustomerCommand> {

  log: ILogger;

  constructor(log: LogService) {
    this.log = log.createLogger('remove-stripe-customer');
  }

  async execute(cmd: RemoveStripeCustomerCommand, resolve: (value?) => void) {
    const { user } = cmd;

    try {
      await stripe.customers.del(user.get('stripe.customerId'));

      if (user.referralCode) {
        await stripe.coupons.del(user.referralCode);
      }
    } catch (e) {
      this.log.error(e);
    }

    resolve();
  }

}