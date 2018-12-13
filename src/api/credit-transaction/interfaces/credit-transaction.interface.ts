import { Document } from 'mongoose';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';

export interface ICreditTransaction extends Document {
  user: string;
  startAmount: number;
  endAmount: number;
  type: TransactionTypes;
  meta: any;
  created_at: Date;

  amount: number;
}