import { Test, TestingModule } from '@nestjs/testing';
import { AlgoliaToken } from 'src/core/search/algolia.provider';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  const clientMock = {
    initIndex: () => '',
    set: () => {},
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
    })
      .overrideProvider(AlgoliaToken).useValue(clientMock)
      .compile();
    service = module.get<SearchService>(SearchService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
