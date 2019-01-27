import { Test, TestingModule } from '@nestjs/testing';
import { PrismicController } from './prismic.controller';

describe('Prismic Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PrismicController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PrismicController = module.get<PrismicController>(PrismicController);
    expect(controller).toBeDefined();
  });
});
