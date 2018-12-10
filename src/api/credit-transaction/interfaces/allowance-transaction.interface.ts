import { Document } from 'mongoose';
import { AllowanceStatuses } from 'src/api/credit-transaction/allowance-statuses.enum';
import { IUser } from 'src/users/interfaces/user.interface';

export interface IAllowanceTransaction extends Document {
  user: string | IUser;
  amount: number;
  status: AllowanceStatuses;
  runOn: string;

  created_at: Date;
  updated_at: Date;
}