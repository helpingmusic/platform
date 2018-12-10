import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { map } from 'rxjs/operators';
import { CreateThreadCommand } from 'src/api/post/commands/create-thread.command';
import { PostCreatedEvent } from 'src/api/post/events/post-created.event';

@Injectable()
export class PostSagas {

  createThread = (events$: EventObservable<PostCreatedEvent>) =>
    events$.ofType(PostCreatedEvent)
      .pipe(map((event: PostCreatedEvent) => new CreateThreadCommand(event.post._id)));

  sagas = [
    this.createThread,
  ];
}