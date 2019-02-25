import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, NestSchedule } from 'nest-schedule';
import { RunCreditAllowancesCommand } from 'src/worker/commands/run-credit-allowances.command';
import { SyncUserIndexCommand } from 'src/worker/commands/sync-user-index.command';

@Injectable()
export class WorkerController extends NestSchedule {

  constructor(private cmdBus: CommandBus) {
    super();
  }

  @Cron('* * * * *')
  async runCreditAllowances() {
    return await this.cmdBus.execute(
      new RunCreditAllowancesCommand(),
    );
  }

  @Cron('0 0 * * *')
  async syncUserIndex() {
    return await this.cmdBus.execute(
      new SyncUserIndexCommand(),
    );
  }
}
