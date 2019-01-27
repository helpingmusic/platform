import { Test, TestingModule } from '@nestjs/testing';
import { CQRSModule } from '@nestjs/cqrs';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { PrismicController } from './prismic.controller';

describe('Prismic Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CQRSModule, LoggerModule],
      controllers: [PrismicController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PrismicController = module.get<PrismicController>(PrismicController);
    expect(controller).toBeDefined();
  });
});
