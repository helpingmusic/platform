import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { CommandHandlers } from 'src/webhooks/stripe/commands';
import { StripeSagas } from 'src/webhooks/stripe/stripe.sagas';
import { StripeController } from './stripe.controller';

@Module({
  imports: [
    SharedModule,
    CQRSModule,
    UsersModule,
  ],
  controllers: [StripeController],
  providers: [
    StripeSagas,
    ...CommandHandlers,
  ],
})
export class StripeModule implements OnModuleInit {

  constructor(
    private moduleRef: ModuleRef,
    private command$: CommandBus,
    private event$: EventBus,
    private stripeSagas: StripeSagas,
  ) {
  }

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.command$.register(CommandHandlers);

    this.event$.combineSagas([
      ...this.stripeSagas.sagas,
    ]);

  }

}
