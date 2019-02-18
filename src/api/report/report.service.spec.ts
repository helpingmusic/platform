import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';

describe('Report Service', () => {
  let module: TestingModule;

  beforeAll(async () => {
    const modelMock = jest.fn().mockImplementation(() => ({
      findById: jest.fn(),
    }));
    module = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getModelToken('Report'),
          useValue: modelMock,
        },
      ],
    })
      .compile();
  });

  it('should be defined', () => {
    const service: ReportService = module.get<ReportService>(ReportService);
    expect(service).toBeDefined();
  });
});
