import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ThreadService } from 'src/api/thread/thread.service';

describe('Post Service', () => {
  let module: TestingModule;

  const modelMock = jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  }));

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        ThreadService,
        {
          provide: getModelToken('Post'),
          useValue: modelMock,
        },
      ],
    })
      .compile();
  });

  it('should be defined', () => {
    const service: ThreadService = module.get<ThreadService>(ThreadService);
    expect(service).toBeDefined();
  });
});
