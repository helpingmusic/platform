import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/shared/config/config.module';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [SearchService],
    }).compile();
    service = module.get<SearchService>(SearchService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
