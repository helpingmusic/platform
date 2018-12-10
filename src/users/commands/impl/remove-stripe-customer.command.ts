import { ICommand } from '@nestjs/cqrs';
import { IUser } from 'src/users/interfaces/user.interface';

export class RemoveStripeCustomerCommand implements ICommand {
  constructor(public user: IUser) {
  }
}