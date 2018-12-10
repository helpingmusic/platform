import { Test, TestingModule } from '@nestjs/testing';
import { BookableService } from 'src/api/bookable/bookable.service';
import { BookableController } from './bookable.controller';

describe('Bookable Controller', () => {
  let module: TestingModule;

  const bookableServiceMock = {};

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [BookableController],
    })
      .overrideProvider(BookableService).useValue(bookableServiceMock)
      .compile();
  });
  it('should be defined', () => {
    const controller: BookableController = module.get<BookableController>(BookableController);
    expect(controller).toBeDefined();
  });
});
