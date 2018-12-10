import { ICommand } from '@nestjs/cqrs';
import { subscriptions } from 'stripe';

export class SyncStripeSubscriptionCommand implements ICommand {
  constructor(public subscription: subscriptions.ISubscription) {
  }
}