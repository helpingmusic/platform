import { IEvent } from '@nestjs/cqrs';
import { IPost } from 'src/api/post/post.interface';

export class PostCreatedEvent implements IEvent {
  constructor(public post: IPost) {
  }
}
