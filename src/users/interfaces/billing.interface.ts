import { Document } from 'mongoose';
import { MembershipPlans, MembershipTiers } from 'src/common/constants';

export interface ICreditCard {
  id: string;
  last4: string;
  brand: string;
  expMonth: string;
  expYear: string;
}

export interface IBilling extends Document {
  customerId: string;
  subscriptionId: string;
  card: ICreditCard;
  accountBalance: number;
  periodEnd: Date;
  plan: MembershipPlans;
  status: string;
  trial_end: Date;
  tier: MembershipTiers;
}