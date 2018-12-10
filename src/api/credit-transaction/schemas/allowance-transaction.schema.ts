import { Schema } from 'mongoose';
import { AllowanceStatuses } from 'src/api/credit-transaction/allowance-statuses.enum';

export const AllowanceTransactionSchema = new Schema({
  user: {
    type: 'ObjectId',
    ref: 'User',
  },

  amount: {
    type: Number,
    required: true,
    default: 0,
  },

  status: {
    type: String,
    required: true,
    enum: {
      values: [AllowanceStatuses.PENDING, AllowanceStatuses.CANCELLED, AllowanceStatuses.USED],
    },
    default: AllowanceStatuses.PENDING,
  },

  // date to run credit update on
  runOn: {
    required: true,
    type: String,
  },

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});