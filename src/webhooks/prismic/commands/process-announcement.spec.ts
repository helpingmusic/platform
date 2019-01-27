import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementService } from 'src/api/announcement/announcement.service';
import { moment } from 'src/common/vendor';
import { ProcessAnnouncementCommand } from 'src/webhooks/prismic/commands/process-announcement.command';
import { ProcessAnnouncementHandler } from 'src/webhooks/prismic/commands/process-announcement.handler';
import { IPrismicAnnouncement } from 'src/webhooks/prismic/documents';

describe('ProcessAnnouncementHandler', () => {

  let handler: ProcessAnnouncementHandler;
  let module: TestingModule;

  const annMock = {
    find: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(null),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        ProcessAnnouncementHandler,
      ],
    })
      .overrideProvider(AnnouncementService).useValue(annMock)
      .compile();

    handler = module.get<ProcessAnnouncementHandler>(ProcessAnnouncementHandler);
  });

  describe('When announcement does not exist', () => {
    const doc: Partial<IPrismicAnnouncement> = {
      first_publication_date: moment().format(),
      last_publication_date: moment().format(),
      data: {
        title: [],
        body: [],
        originally_published: new Date(),
      },
    };
    const cmd = new ProcessAnnouncementCommand(doc as IPrismicAnnouncement);

    beforeAll(() => new Promise((res) => handler.execute(cmd, res)));

    it('should create new announcement', async () => {
      expect(annMock.create).toBeCalledTimes(1);
    });
  });

  describe('When announcement does exist', () => {
    const doc: Partial<IPrismicAnnouncement> = {
      first_publication_date: moment().format(),
      last_publication_date: moment().format(),
      id: '123',
      data: {
        title: [],
        body: [],
        originally_published: new Date(),
      },
    };
    const cmd = new ProcessAnnouncementCommand(doc as IPrismicAnnouncement);

    beforeAll(() => {
      annMock.find.mockResolvedValue([{ cmsId: '123', _id: '1' }]);
      return new Promise((res) => handler.execute(cmd, res));
    });

    it('should update announcement', async () => {
      expect(annMock.update).toBeCalledTimes(1);
    });
  });


});