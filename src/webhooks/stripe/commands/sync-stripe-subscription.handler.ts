import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/users/services/users.service';
import { SyncStripeSubscriptionCommand } from './sync-stripe-subscription.command';

@CommandHandler(SyncStripeSubscriptionCommand)
export class SyncStripeSubscriptionHandler implements ICommandHandler<SyncStripeSubscriptionCommand> {

  constructor(private userService: UsersService) {
  }

  async execute(cmd: SyncStripeSubscriptionCommand, resolve: (value?) => void) {
    const { subscription: sub } = cmd;

    const updates: any = {
      'stripe.subscriptionId': sub.id,
      'stripe.plan': sub.plan.id,
      'stripe.status': sub.status,
      'stripe.trial_end': sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      'stripe.periodEnd': new Date(sub.current_period_end * 1000),
    };

    updates.active_until = updates['stripe.periodEnd'];

    if (sub.plan.metadata.tier) updates['stripe.tier'] = sub.plan.metadata.tier;

    const user = await this.userService.findOne({
      'stripe.customerId': sub.customer,
    });

    if (!user) return;

    await this.userService.update(user, updates);

    resolve();
  }

}