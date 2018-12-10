import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { IssueCreatedEvent } from 'src/api/issue/events/issue-created.event';
import { IIssue } from 'src/api/issue/issue.interface';
import { IssueSchema } from 'src/api/issue/issue.schema';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class IssueEventsModel extends SchemaEventModel<IIssue> {
  constructor(protected events$: EventBus) {
    super(IssueSchema, events$);
  }

  created(i: IIssue) {
    this.events$.publish(
      new IssueCreatedEvent(i),
    );
  }

  saved(a: IIssue, changes: IModelChanges) {
  }

  removed(a: IIssue) {
  }
}
