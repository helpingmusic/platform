import { Schema } from 'mongoose';
import * as constants from 'src/common/constants';

const { membershipTiers } = constants;

export const UserBillingSchema = new Schema({
  customerId: { type: String, default: null },
  subscriptionId: { type: String, default: null },
  accountBalance: { type: Number, default: 0 },

  card: {
    id: String,
    last4: String,
    brand: String,
    expMonth: Number,
    expYear: Number,
  },

  plan: { type: String, default: null },
  status: { type: String },

  tier: {
    type: String,
    enum: { values: membershipTiers },
    default: 'community',
  },
  legacyTier: String,

  frequency: {
    type: String,
    enum: { values: ['monthly', 'yearly'] },
    default: 'monthly',
  },

  couponUsed: String,
  couponEnd: Date,

  trial_end: { type: Date, default: null },
  periodEnd: { type: Date, default: null },
});