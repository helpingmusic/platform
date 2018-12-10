import { ICommand } from '@nestjs/cqrs';
import { coupons } from 'stripe';

export class CreditMemberReferralCommand implements ICommand {
  constructor(public discount: coupons.IDiscount) {
  }
}