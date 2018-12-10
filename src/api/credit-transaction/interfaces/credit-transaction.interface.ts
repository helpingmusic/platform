import { Document } from 'mongoose';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';
import { IUser } from 'src/users/interfaces/user.interface';

export interface ICreditTransaction extends Document {
  user: string | IUser;
  startAmount: number;
  endAmount: number;
  type: TransactionTypes;
  meta: any;
  created_at: Date;

  amount: number;
}