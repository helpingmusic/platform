import { IEvent } from '@nestjs/cqrs';
import { IDiscount } from 'src/api/discount/discount.interface';

export class DiscountCreatedEvent implements IEvent {
  constructor(public discount: IDiscount) {
  }
}
