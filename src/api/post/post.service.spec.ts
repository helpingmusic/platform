import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ThreadService } from 'src/api/thread/thread.service';
import { PostService } from './post.service';

describe('Post Service', () => {
  let module: TestingModule;

  const modelMock = jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  }));

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken('Post'),
          useValue: modelMock,
        },
      ],
    })
      .overrideProvider(ThreadService).useValue({})
      .compile();
  });

  it('should be defined', () => {
    const service: PostService = module.get<PostService>(PostService);
    expect(service).toBeDefined();
  });
});
