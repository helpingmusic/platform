import { ICommand } from '@nestjs/cqrs';
import { invoices } from 'stripe';

export class SendUserInvoiceCommand implements ICommand {
  constructor(public invoice: invoices.IInvoice) {
  }
}