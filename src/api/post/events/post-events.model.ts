import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { PostCreatedEvent } from 'src/api/post/events/post-created.event';
import { IPost } from 'src/api/post/post.interface';
import { PostSchema } from 'src/api/post/post.schema';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class PostEventsModel extends SchemaEventModel<IPost> {
  constructor(protected events$: EventBus) {
    super(PostSchema, events$);
  }

  created(a: IPost) {
    this.events$.publish(
      new PostCreatedEvent(a),
    );
  }

  saved(a: IPost, changes: IModelChanges) {
  }

  removed(a: IPost) {
  }
}
