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

    const updates = {
      'stripe.accountBalance': customer.account_balance,
    };

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