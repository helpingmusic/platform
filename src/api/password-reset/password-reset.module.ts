import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandHandlers } from 'src/api/password-reset/commands';
import { PasswordResetSchema } from 'src/api/password-reset/password-reset.schema';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';

@Module({
  imports: [
    CQRSModule,
    MongooseModule.forFeature([{ name: 'PasswordReset', schema: PasswordResetSchema }]),
    SharedModule,
    UsersModule,
  ],
  providers: [
    PasswordResetService,
    ...CommandHandlers,
  ],
  controllers: [PasswordResetController],
})
export class PasswordResetModule implements OnModuleInit {

  constructor(
    private moduleRef: ModuleRef,
    private cmd$: CommandBus,
  ) {
  }

  onModuleInit() {
    this.cmd$.setModuleRef(this.moduleRef);
    this.cmd$.register(CommandHandlers);
  }

}
