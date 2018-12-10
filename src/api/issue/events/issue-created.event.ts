import { IEvent } from '@nestjs/cqrs';
import { IIssue } from 'src/api/issue/issue.interface';

export class IssueCreatedEvent implements IEvent {
  constructor(public issue: IIssue) {
  }
}
