import { Module } from '@nestjs/common';
import { EmailModule } from 'src/core/email/email.module';
import { StorageModule } from 'src/core/storage/storage.module';
import { ConfigModule } from 'src/shared/config/config.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    StorageModule,
  ],
  providers: [],
  exports: [
    EmailModule,
    StorageModule,
  ],
})
export class CoreModule {
}
