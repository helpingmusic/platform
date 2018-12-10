import { Test, TestingModule } from '@nestjs/testing';
import { CQRSModule, EventBus } from '@nestjs/cqrs';
import { Document } from 'mongoose';
import { IAnnouncement } from 'src/api/announcement/announcement.interface';
import { SendNotificationHandler } from 'src/api/announcement/commands/send-notification.handler';
import { AnnouncementEvents } from 'src/api/announcement/events/announcement-events.model';
import { NotificationCreatedEvent } from 'src/api/notifications/events/notification-created.event';

describe('Announcement Created Handler', () => {
  let module: TestingModule;
  let events: AnnouncementEvents;
  let bus: EventBus;

  const handlerMock = jest.fn();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CQRSModule],
      providers: [
        AnnouncementEvents,
        {
          provide: SendNotificationHandler,
          useValue: { handle: handlerMock },
        },
      ],
    })
      .compile();

    await module.init();

    bus = module.get<EventBus>(EventBus);
    bus.setModuleRef(module);
    // bus.register([SendNotificationHandler]);

    events = module.get<AnnouncementEvents>(AnnouncementEvents);
  });

  it('should call handle on create', async function() {
    const doc = { _id: '1' } as Document;

    events.created(doc as IAnnouncement);

    expect(handlerMock).toHaveBeenCalled();
    const event = handlerMock.mock.calls[0][0];
    expect(event).toBeInstanceOf(NotificationCreatedEvent);
  });

});