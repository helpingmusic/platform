import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementService } from './announcement.service';

describe('IAnnouncement Service', () => {
  let module: TestingModule;

  const modelMock = jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  }));

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        AnnouncementService,
        {
          provide: getModelToken('Announcement'),
          useValue: modelMock,
        },
      ],
    })
      .compile();
  });

  it('should be defined', () => {
    const service: AnnouncementService = module.get<AnnouncementService>(AnnouncementService);
    expect(service).toBeDefined();
  });
});
