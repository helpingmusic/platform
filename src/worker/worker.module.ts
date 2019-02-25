import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus } from '@nestjs/cqrs';
import { CreditTransactionModule } from 'src/api/credit-transaction/credit-transaction.module';
import { SearchModule } from 'src/core/search/search.module';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { CommandHandlers } from 'src/worker/commands';
import { WorkerController } from 'src/worker/worker.controller';

@Module({
  imports: [
    SharedModule,
    UsersModule,
    CreditTransactionModule,
    SearchModule,
  ],
  exports: [
    WorkerController,
  ],
  providers: [
    WorkerController,
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
