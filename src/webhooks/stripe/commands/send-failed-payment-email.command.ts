import { ICommand } from '@nestjs/cqrs';
import { invoices } from 'stripe';

export class SendFailedPaymentEmailCommand implements ICommand {
  constructor(public invoice: invoices.IInvoice) {
  }
}