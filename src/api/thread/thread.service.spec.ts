import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ThreadService } from 'src/api/thread/thread.service';
import { CreateModelMock } from 'fixtures/mocks/model.mock';

describe('Post Service', () => {
  let module: TestingModule;

  const modelMock = CreateModelMock('Thread');

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        ThreadService,
        {
          provide: getModelToken('Thread'),
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
