import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { CronService } from './cron.service';

@Module({
  imports: [SharedModule],
  providers: [CronService],
})
export class CronModule {
}
