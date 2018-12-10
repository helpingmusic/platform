import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/users/services/users.service';
import { SyncCreditCardCommand } from 'src/webhooks/stripe/commands/sync-credit-card.command';

@CommandHandler(SyncCreditCardCommand)
export class SyncCreditCardHandler implements ICommandHandler<SyncCreditCardCommand> {

  constructor(private userService: UsersService) {
  }

  async execute(cmd: SyncCreditCardCommand, resolve: (value?) => void) {
    const { card } = cmd;

    if (!card) return resolve(false);

    const user = await this.userService.findOne({
      'stripe.customerId': card.customer,
    });

    if (!user) return resolve(false);

    await this.userService.update(user, {
      'stripe.card': {
        id: card.id,
        last4: card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year,
      },
    });

    resolve();
  }

}