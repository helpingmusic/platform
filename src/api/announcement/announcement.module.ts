import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AnnouncementSagas } from 'src/api/announcement/announcement.sagas';
import { CommandHandlers } from 'src/api/announcement/commands';
import { AnnouncementEvents } from 'src/api/announcement/events/announcement-events.model';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { AnnouncementController } from './announcement.controller';

import { AnnouncementSchema } from './announcement.schema';
import { AnnouncementService } from './announcement.service';

@Module({
  imports: [
    CQRSModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Announcement', schema: AnnouncementSchema }]),
    SharedModule,
    UsersModule,
  ],
  controllers: [AnnouncementController],
  exports: [AnnouncementService],
  providers: [
    AnnouncementService,
    AnnouncementEvents,
    AnnouncementSagas,
    ...CommandHandlers,
  ],
})
export class AnnouncementModule implements OnModuleInit {

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly event$: EventBus,
    private readonly cmd$: CommandBus,
    private announcementEvents: AnnouncementEvents,
    private sagas: AnnouncementSagas,
  ) {
  }

  onModuleInit() {
    this.event$.setModuleRef(this.moduleRef);
    this.cmd$.setModuleRef(this.moduleRef);

    this.cmd$.register(CommandHandlers);
    this.event$.combineSagas(this.sagas.sagas);
  }

}
