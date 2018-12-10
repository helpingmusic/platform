import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CommandHandlers } from 'src/api/issue/commands';
import { IssueEventsModel } from 'src/api/issue/events/issue-events.model';
import { IssueSagas } from 'src/api/issue/issue.sagas';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { IssueController } from './issue.controller';

import { IssueSchema } from './issue.schema';
import { IssueService } from './issue.service';

@Module({
  imports: [
    CQRSModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Issue', schema: IssueSchema }]),
    SharedModule,
    UsersModule,
  ],
  controllers: [IssueController],
  providers: [
    IssueService,
    IssueEventsModel,
    IssueSagas,
    ...CommandHandlers,
  ],
})
export class IssueModule implements OnModuleInit {

  constructor(
    private events: IssueEventsModel,
    private moduleRef: ModuleRef,
    private cmd$: CommandBus,
    private event$: EventBus,
    private sagas: IssueSagas,
  ) {
  }

  onModuleInit() {
    this.cmd$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.cmd$.register(CommandHandlers);

    this.event$.combineSagas(this.sagas.sagas);
  }
}
