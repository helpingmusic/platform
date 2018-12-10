import { Module } from '@nestjs/common';
import { LogService } from 'src/shared/logger/log.service';

@Module({
  providers: [LogService],
  exports: [LogService],
})
export class LoggerModule {
}
