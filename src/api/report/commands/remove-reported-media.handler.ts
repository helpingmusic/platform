import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveReportedMediaCommand } from 'src/api/report/commands/remove-reported-media.command';
import { IRemovableMedia } from 'src/api/report/interfaces/removable-media';
import { ReportStatus } from 'src/api/report/report-status.enum';

@CommandHandler(RemoveReportedMediaCommand)
export class RemoveReportedMediaHandler implements ICommandHandler<RemoveReportedMediaCommand> {
  constructor() {
  }

  async execute(cmd: RemoveReportedMediaCommand, resolve: (value?) => void) {
    const { report } = cmd;

    await report.populate('media.item').execPopulate();
    const media = report.get('media.item') as IRemovableMedia;

    if (report.status === ReportStatus.REMOVED) {
      await media.remove();
    } else {
      await media.show();
    }

    resolve();
  }
}