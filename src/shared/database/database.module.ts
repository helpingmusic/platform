import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'src/shared/config/config.module';
import { ConfigService } from 'src/shared/config/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      // connectionName: 'DatabaseConnection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({ uri: config.get('DB_URI') }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {
}
