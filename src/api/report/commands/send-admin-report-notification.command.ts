import { ICommand } from '@nestjs/cqrs';
import { IReport } from 'src/api/report/interfaces/report.interface';

export class SendAdminReportNotificationCommand implements ICommand {
  constructor(
    public report: IReport,
  ) {
  }
}