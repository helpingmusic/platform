import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { IComment } from 'src/api/thread/comments/comment.interface';
import { CommentSchema } from 'src/api/thread/comments/comment.schema';
import { CommentCreatedEvent } from 'src/api/thread/comments/events/comment-created.event';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class CommentEventsModel extends SchemaEventModel<IComment> {
  constructor(protected events$: EventBus) {
    super(CommentSchema, events$);
  }

  created(c: IComment) {
    this.events$.publish(
      new CommentCreatedEvent(c),
    );
  }

  saved(c: IComment, changes: IModelChanges) {
  }

  removed(c: IComment) {
  }
}
