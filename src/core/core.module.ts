import { Module } from '@nestjs/common';
import { EmailModule } from 'src/core/email/email.module';
import { SearchModule } from 'src/core/search/search.module';
import { StorageModule } from 'src/core/storage/storage.module';
import { ConfigModule } from 'src/shared/config/config.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    StorageModule,
    SearchModule,
  ],
  providers: [],
  exports: [
    EmailModule,
    StorageModule,
    SearchModule,
  ],
})
export class CoreModule {
}
