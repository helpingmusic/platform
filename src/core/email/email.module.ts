import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule } from '@nestjs/cqrs';
import { CommandHandlers } from 'src/core/email/commands';
import { SharedModule } from 'src/shared/shared.module';
import { EmailService } from './email.service';

@Module({
  imports: [SharedModule, CQRSModule],
  providers: [
    EmailService,
    ...CommandHandlers,
  ],
  exports: [EmailService],
})
export class EmailModule implements OnModuleInit {

  constructor(
    private moduleRef: ModuleRef,
    private cmdBus: CommandBus,
  ) {
  }

  onModuleInit() {
    this.cmdBus.setModuleRef(this.moduleRef);
    this.cmdBus.register(CommandHandlers);
  }
}
