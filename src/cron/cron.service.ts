import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Log } from 'algoliasearch';
import { Cron, defaults, NestSchedule } from 'nest-schedule';
import { first } from 'rxjs/operators';
import { ConfigService } from 'src/shared/config/config.service';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';

defaults.enable = true;
defaults.maxRetry = -1;
defaults.retryInterval = 5000;

@Injectable()
export class CronService extends NestSchedule {

  client: ClientProxy;
  log: ILogger;

  constructor(
    private config: ConfigService,
    log: LogService,
  ) {
    super();

    this.log = log.createLogger('Cron');

    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: this.config.get('REDIS_URI'),
      },
    });
  }

  private runJob(cmd, data = {}) {
    this.log.info(cmd);
    return this.client.send(cmd, data)
      .pipe(first())
      .subscribe();
  }

  @Cron('0 0 4 * *')
  async runCreditAllowances() {
    this.runJob({ cmd: 'run-credit-allowances' });
  }

  @Cron('0 * * * *')
  async syncUserIndex() {
    this.runJob({ cmd: 'sync-user-index' });
  }
}
