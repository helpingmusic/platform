import { ICommand } from '@nestjs/cqrs';
import { IPrismicAnnouncement } from 'src/webhooks/prismic/documents';

export class ProcessAnnouncementCommand implements ICommand {
  constructor(public doc: IPrismicAnnouncement) {}
}