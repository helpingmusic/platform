import { ICommand } from '@nestjs/cqrs';
import { IDiscount } from 'src/api/discount/discount.interface';

export class SendDiscountNotificationCommand implements ICommand {
  constructor(
    public discount: IDiscount,
  ) {
  }
}