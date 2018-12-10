import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FactoryService } from 'fixtures/factory/factory.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    // MongooseModule.forFeature(),
  ],
  providers: [
    FactoryService,
  ],
})
export class FactoryModule {}