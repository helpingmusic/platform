import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';

describe('Video Service', () => {
  let module: TestingModule;

  const modelMock = jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  }));

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getModelToken('Video'),
          useValue: modelMock,
        },
      ],
    })
      .compile();
  });

  it('should be defined', () => {
    const service: VideoService = module.get<VideoService>(VideoService);
    expect(service).toBeDefined();
  });
});
