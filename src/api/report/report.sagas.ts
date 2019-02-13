import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { filter, map } from 'rxjs/operators';
import { RemoveReportedMediaCommand } from 'src/api/report/commands/remove-reported-media.command';
import { SendAdminReportNotificationCommand } from 'src/api/report/commands/send-admin-report-notification.command';
import { ReportCreatedEvent } from 'src/api/report/events/report-created.event';
import { ReportResolvedEvent } from 'src/api/report/events/report-resolved.event';
import { ReportStatus } from 'src/api/report/report-status.enum';

@Injectable()
export class ReportSagas {

  sendAdminNotification = (events$: EventObservable<ReportCreatedEvent>) =>
    events$.ofType(ReportCreatedEvent)
      .pipe(map(event => new SendAdminReportNotificationCommand(event.report)))

  hideReportedItem = (events$: EventObservable<ReportResolvedEvent>) =>
    events$.ofType(ReportResolvedEvent)
      .pipe(
        filter(event => event.report.status === ReportStatus.REMOVED),
        map(event => new RemoveReportedMediaCommand(event.report)),
      )

  sagas = [
    this.sendAdminNotification,
    this.hideReportedItem,
  ];
}