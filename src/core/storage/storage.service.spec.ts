import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/shared/config/config.module';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [StorageService],
    })
      .compile();
    service = module.get<StorageService>(StorageService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
