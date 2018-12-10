import { ICommand } from '@nestjs/cqrs';
import { IUser } from 'src/users/interfaces/user.interface';

export class CreateReferralCouponCommand implements ICommand {
  constructor(public user: IUser) {
  }
}