import { ICommand } from '@nestjs/cqrs';
import { customers } from 'stripe';

export class SyncCustomerCommand implements ICommand {
  constructor(public customer: customers.ICustomer) {
  }
}