import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CQRSModule } from '@nestjs/cqrs';
import { ConfigModule } from 'src/shared/config/config.module';
import { DatabaseModule } from 'src/shared/database/database.module';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  imports: [
    CQRSModule,
    ConfigModule,
    LoggerModule,
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
  ],
  exports: [
    ConfigModule,
    LoggerModule,
    CQRSModule,
    PassportModule,
    DatabaseModule,
  ],
})
export class SharedModule {}
