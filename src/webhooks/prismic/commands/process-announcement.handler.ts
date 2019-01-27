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

    // If old announcement is created, don't create locally because it will blast notification
    const skipCreate = doc.data.originally_published && moment().subtract(2, 'day').isAfter(doc.data.originally_published);

    const body = {
      title: RichText.asText(doc.data.title),
      body: RichText.asText(doc.data.body),
      created_at: moment(doc.data.originally_published || doc.first_publication_date).toDate(),
      updated_at: moment(doc.last_publication_date).toDate(),
    };

    const [existing] = await this.announcements.find({ cmsId: doc.id });
    if (existing) {
      await this.announcements.update(existing, body);
    } else if (!skipCreate) {
      await this.announcements.create({ ...body, cmsId: doc.id });
    }

    resolve();
  }
}
