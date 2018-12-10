import { ICommand } from '@nestjs/cqrs';
import { IReview } from 'src/api/review/review.interface';

export class SendReviewNotificationCommand implements ICommand {
  constructor(
    public review: IReview,
  ) {
  }
}