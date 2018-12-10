import { ICommand } from '@nestjs/cqrs';
import { ICard } from 'stripe';

export class SyncCreditCardCommand implements ICommand {
  constructor(public card: ICard) {
  }
}