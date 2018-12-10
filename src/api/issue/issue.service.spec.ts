import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { IssueService } from './issue.service';

describe('Issue Service', () => {
  let module: TestingModule;

  const modelMock = jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  }));

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        IssueService,
        {
          provide: getModelToken('Issue'),
          useValue: modelMock,
        },
      ],
    })
      .compile();
  });

  it('should be defined', () => {
    const service: IssueService = module.get<IssueService>(IssueService);
    expect(service).toBeDefined();
  });
});
