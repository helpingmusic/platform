import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscountService } from './discount.service';

describe('Discount Service', () => {
  let module: TestingModule;

  const modelMock = jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  }));

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        DiscountService,
        {
          provide: getModelToken('Discount'),
          useValue: modelMock,
        },
      ],
    })
      .compile();
  });

  it('should be defined', () => {
    const service: DiscountService = module.get<DiscountService>(DiscountService);
    expect(service).toBeDefined();
  });
});
