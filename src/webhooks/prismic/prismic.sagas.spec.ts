import { CommandBus, CQRSModule, EventBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { take } from 'rxjs/operators';
import { AnnouncementService } from 'src/api/announcement/announcement.service';
import { CmsService } from 'src/webhooks/prismic/cms.service';
import { CommandHandlers } from 'src/webhooks/prismic/commands';
import { ProcessAnnouncementCommand } from 'src/webhooks/prismic/commands/process-announcement.command';
import { ProcessAnnouncementHandler } from 'src/webhooks/prismic/commands/process-announcement.handler';
import { DocTypes, IPrismicAnnouncement } from 'src/webhooks/prismic/documents';
import { PrismicEvent } from 'src/webhooks/prismic/prismic.event';
import { PrismicSagas } from 'src/webhooks/prismic/prismic.sagas';

jest.mock('src/webhooks/prismic/commands/process-announcement.command');

describe('Prismic Sagas', () => {
  let module: TestingModule;
  let event$: EventBus;
  let sagas: PrismicSagas;
  let cmd$: CommandBus;

  const cmsServiceMock: any = {};

  beforeAll(async () => {

    module = await Test.createTestingModule({
      imports: [CQRSModule],
      providers: [
        PrismicSagas,
        ...CommandHandlers,
      ],
    })
      .overrideProvider(CmsService).useValue(cmsServiceMock)
      .overrideProvider(AnnouncementService).useValue({})
      .overrideProvider(ProcessAnnouncementHandler).useValue({ execute: jest.fn() })
      .compile();

    await module.init();

    sagas = module.get<PrismicSagas>(PrismicSagas);

    cmd$ = module.get<CommandBus>(CommandBus);
    cmd$.setModuleRef(module);
    cmd$.register(CommandHandlers);

    event$ = module.get<EventBus>(EventBus);
    event$.setModuleRef(module);
    event$.combineSagas(sagas.sagas);
  });

  it('should be defined', () => {
    expect(sagas).toBeDefined();
  });

  it('should fire ProcessAnnouncementCommand on webhook', async () => {
    const ann: Partial<IPrismicAnnouncement> = { type: DocTypes.ANNOUNCEMENT };
    cmsServiceMock.getLatestDocs = jest.fn().mockResolvedValue({
      results: [ann, ann, { type: '' }],
    });

    const e = new PrismicEvent();
    event$.publish(e);

    await cmd$.pipe(take(2)).toPromise();

    expect(cmsServiceMock.getLatestDocs).toHaveBeenCalledTimes(1);
    expect(ProcessAnnouncementCommand).toHaveBeenCalledTimes(2);
  });

});
