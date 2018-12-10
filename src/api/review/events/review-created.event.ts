import { IEvent } from '@nestjs/cqrs';
import { IReview } from 'src/api/review/review.interface';

export class ReviewCreatedEvent implements IEvent {
  constructor(public review: IReview) {
  }
}
