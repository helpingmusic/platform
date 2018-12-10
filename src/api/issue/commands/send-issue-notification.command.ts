import { ICommand } from '@nestjs/cqrs';
import { IIssue } from 'src/api/issue/issue.interface';

export class SendIssueNotificationCommand implements ICommand {
  constructor(
    public issue: IIssue,
  ) {
  }
}