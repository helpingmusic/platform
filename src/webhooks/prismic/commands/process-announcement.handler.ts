import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnnouncementService } from 'src/api/announcement/announcement.service';
import { moment } from 'src/common/vendor';
import { ProcessAnnouncementCommand } from 'src/webhooks/prismic/commands/process-announcement.command';
import { RichText } from 'prismic-dom';

@CommandHandler(ProcessAnnouncementCommand)
export class ProcessAnnouncementHandler implements ICommandHandler<ProcessAnnouncementCommand> {

  constructor(private announcements: AnnouncementService) {}

  async execute(cmd: ProcessAnnouncementCommand, resolve: (value?) => void) {
    const { doc } = cmd;

    const body = {
      title: RichText.asText(doc.data.title),
      body: RichText.asText(doc.data.body),
      created_at: moment(doc.data.originally_published || doc.first_publication_date).toDate(),
      updated_at: moment(doc.last_publication_date).toDate(),
    };

    const [existing] = await this.announcements.find({ cmsId: doc.id });
    if (existing) {
      await this.announcements.update(existing, body);
    } else {
      await this.announcements.create({ ...body, cmsId: doc.id });
    }

    resolve();
  }
}
