import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ReviewCreatedEvent } from 'src/api/review/events/review-created.event';
import { IReview } from 'src/api/review/review.interface';
import { ReviewSchema } from 'src/api/review/review.schema';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class ReviewEventsModel extends SchemaEventModel<IReview> {
  constructor(protected events$: EventBus) {
    super(ReviewSchema, events$);
  }

  created(a: IReview) {
    this.events$.publish(
      new ReviewCreatedEvent(a),
    );
  }

  saved(a: IReview, changes: IModelChanges) {
  }

  removed(a: IReview) {
  }
}
