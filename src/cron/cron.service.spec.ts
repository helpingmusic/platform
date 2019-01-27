import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/shared/config/config.module';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { CronService } from './cron.service';

describe('CronService', () => {
  let service: CronService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, ConfigModule],
      providers: [CronService],
    }).compile();
    service = module.get<CronService>(CronService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
