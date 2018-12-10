import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { filter, map } from 'rxjs/operators';
import { SendParentCommentNotificationCommand } from 'src/api/thread/comments/commands/send-parent-comment-notification.command';
import { SendPosterCommentNotificationCommand } from 'src/api/thread/comments/commands/send-poster-comment-notification.command';
import { CommentCreatedEvent } from 'src/api/thread/comments/events/comment-created.event';

@Injectable()
export class CommentSagas {

  notifyMediaPoster$ = (events$: EventObservable<CommentCreatedEvent>) =>
    events$.ofType(CommentCreatedEvent)
      .pipe(map(event => new SendPosterCommentNotificationCommand(event.comment)));

  notifyParentCommenter$ = (events$: EventObservable<CommentCreatedEvent>) =>
    events$.ofType(CommentCreatedEvent)
      .pipe(
        filter(({ comment }) => !!comment.parent), // only notify parent if they exist
        map(event => new SendParentCommentNotificationCommand(event.comment)),
      );

  sagas = [
    this.notifyMediaPoster$,
    this.notifyParentCommenter$,
  ];
}