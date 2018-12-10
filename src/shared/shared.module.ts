import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CQRSModule } from '@nestjs/cqrs';
import { ConfigModule } from 'src/shared/config/config.module';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    CQRSModule,
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
  ],
})
export class SharedModule {}
