import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/users/services/users.service';
import { cards } from 'stripe';
import { SyncCustomerCommand } from './sync-customer.command';

@CommandHandler(SyncCustomerCommand)
export class SyncCustomerHandler implements ICommandHandler<SyncCustomerCommand> {

  constructor(private userService: UsersService) {
  }

  async execute(cmd: SyncCustomerCommand, resolve: (value?) => void) {
    const { customer } = cmd;

    let updates: any = {
      'stripe.accountBalance': customer.account_balance,
    };

    if (customer.subscriptions.data) {
      const sub = customer.subscriptions.data
        .sort((a, b) => a.created - b.created)
        .pop();
      updates = {
        ...updates,
        'stripe.subscriptionId': sub.id,
        'stripe.plan': sub.plan.id,
        'stripe.status': sub.status,
        'stripe.trial_end': sub.trial_end ? new Date(sub.trial_end * 1000) : null,
        'stripe.periodEnd': new Date(sub.current_period_end * 1000),
      };
    }

    const c = customer.default_source as cards.ICard;
    if (c && c.id) {
      updates['stripe.card'] = {
        id: c.id,
        last4: c.last4,
        brand: c.brand,
        expMonth: c.exp_month,
        expYear: c.exp_year,
      };
    }

    const user = await this.userService.findOne({
      'stripe.customerId': customer.id,
    });

    if (!user) return;

    await this.userService.update(user, updates);

    resolve();
  }

}