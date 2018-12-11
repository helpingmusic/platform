import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'src/database/database.module';
import { SearchModule } from 'src/search/search.module';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { CommandHandlers } from 'src/worker/commands';
import { WorkerController } from 'src/worker/worker.controller';

@Module({
  imports: [
    CQRSModule,
    SharedModule,
    DatabaseModule,
    UsersModule,
    SearchModule,
  ],
  controllers: [
    WorkerController,
  ],
  providers: [
    ...CommandHandlers,
  ],
})
export class WorkerModule implements OnModuleInit {

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
