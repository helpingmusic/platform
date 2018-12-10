import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { IAnnouncement } from 'src/api/announcement/announcement.interface';
import { AnnouncementSchema } from 'src/api/announcement/announcement.schema';
import { AnnouncementCreatedEvent } from 'src/api/announcement/events/announcement-created.event';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class AnnouncementEvents extends SchemaEventModel<IAnnouncement> {
  constructor(protected events$: EventBus) {
    super(AnnouncementSchema, events$);
  }

  created(a: IAnnouncement) {
    this.events$.publish(
      new AnnouncementCreatedEvent(a),
    );
  }

  saved(a: IAnnouncement, changes: IModelChanges) {}

  removed(a: IAnnouncement) {}
}
