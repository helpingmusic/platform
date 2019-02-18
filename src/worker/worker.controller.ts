import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { RunCreditAllowancesCommand } from 'src/worker/commands/run-credit-allowances.command';
import { SyncUserIndexCommand } from 'src/worker/commands/sync-user-index.command';

@Injectable()
export class WorkerController {

  constructor(private cmdBus: CommandBus) {
  }

  @MessagePattern('ping')
  async ping() {
  }

  @MessagePattern({ cmd: 'run-credit-allowances' })
  async runCreditAllowances() {
    return await this.cmdBus.execute(
      new RunCreditAllowancesCommand(),
    );
  }

  @MessagePattern({ cmd: 'sync-user-index' })
  async syncUserIndex() {
    return await this.cmdBus.execute(
      new SyncUserIndexCommand(),
    );
  }
}
