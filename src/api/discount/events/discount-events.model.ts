import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { IDiscount } from 'src/api/discount/discount.interface';
import { DiscountSchema } from 'src/api/discount/discount.schema';
import { DiscountCreatedEvent } from 'src/api/discount/events/discount-created.event';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class DiscountEventsModel extends SchemaEventModel<IDiscount> {
  constructor(protected events$: EventBus) {
    super(DiscountSchema, events$);
  }

  created(d: IDiscount) {
    this.events$.publish(
      new DiscountCreatedEvent(d),
    );
  }

  saved(a: IDiscount, changes: IModelChanges) {
  }

  removed(a: IDiscount) {
  }
}
