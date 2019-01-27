import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { AnnouncementModule } from 'src/api/announcement/announcement.module';
import { CommandHandlers } from 'src/webhooks/prismic/commands';
import { PrismicSagas } from 'src/webhooks/prismic/prismic.sagas';
import { PrismicController } from './prismic.controller';
import { CmsService } from './cms.service';

@Module({
  imports: [
    CQRSModule,
    AnnouncementModule,
  ],
  controllers: [PrismicController],
  providers: [
    CmsService,
    ...CommandHandlers,
    PrismicSagas,
  ],
})
export class PrismicModule {
  constructor(
    private moduleRef: ModuleRef,
    private command$: CommandBus,
    private event$: EventBus,
    private sagas: PrismicSagas,
  ) {
  }

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.command$.register(CommandHandlers);

    this.event$.combineSagas([
      ...this.sagas.sagas,
    ]);
  }

}
