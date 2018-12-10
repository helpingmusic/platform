import { IEvent } from '@nestjs/cqrs';
import { IReport } from 'src/api/report/interfaces/report.interface';

export class ReportResolvedEvent implements IEvent {
  constructor(public report: IReport) {
  }
}
