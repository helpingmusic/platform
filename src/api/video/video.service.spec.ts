import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateModelMock } from 'fixtures/mocks/model.mock';
import { VideoService } from './video.service';

describe('Video Service', () => {
  let module: TestingModule;

  const modelMock = CreateModelMock('Media');

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getModelToken('Media'),
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
