import { ICommand } from '@nestjs/cqrs';
import { IReport } from 'src/api/report/interfaces/report.interface';

export class RemoveReportedMediaCommand implements ICommand {
  constructor(public report: IReport) {
  }
}