import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { StorageService } from './storage.service';

@Module({
  imports: [SharedModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {
}
