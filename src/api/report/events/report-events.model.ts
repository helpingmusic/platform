import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ReportCreatedEvent } from 'src/api/report/events/report-created.event';
import { ReportResolvedEvent } from 'src/api/report/events/report-resolved.event';
import { IReport } from 'src/api/report/interfaces/report.interface';
import { ReportSchema } from 'src/api/report/report.schema';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class ReportEventsModel extends SchemaEventModel<IReport> {
  constructor(protected events$: EventBus) {
    super(ReportSchema, events$);
  }

  created(a: IReport) {
    this.events$.publish(
      new ReportCreatedEvent(a),
    );
  }

  saved(a: IReport, changes: IModelChanges) {

    if (changes.resolved_at) {
      this.events$.publish(
        new ReportResolvedEvent(a),
      );
    }
  }

  removed(a: IReport) {
  }
}
