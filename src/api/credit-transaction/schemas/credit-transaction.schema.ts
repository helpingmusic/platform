import { Schema } from 'mongoose';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';

export const CreditTransactionSchema = new Schema({

  user: {
    type: 'ObjectId',
    ref: 'User',
  },

  startAmount: {
    type: Number,
    required: true,
  },

  endAmount: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: {
      values: [
        TransactionTypes.CREDIT_REDEEM,
        TransactionTypes.ADMIN_SET,
        TransactionTypes.MONTHLY_ALLOWANCE,
        TransactionTypes.ALLOWANCE,
      ],
    },
  },

  meta: {
    type: Object,
    default: {},
  },

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

CreditTransactionSchema.virtual('amount')
  .get(function() {
    return this.startAmount - this.endAmount;
  });

CreditTransactionSchema.pre('validate', async function(next) {
  if (!this.isNew) return next();

  console.log('Update user credits');
  await this.populate({ path: 'user', select: 'credits' }).execPopulate();
  this.set({ startAmount: this.get('user').credits });
  // Update user credit amount
  await this.get('user').update({ credits: this.get('endAmount') });
  this.depopulate('user');

  return next();
});
