import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Cron, defaults, NestSchedule } from 'nest-schedule';
import { first } from 'rxjs/operators';
import { ConfigService } from 'src/shared/config/config.service';

defaults.enable = true;
defaults.maxRetry = -1;
defaults.retryInterval = 5000;

@Injectable()
export class CronService extends NestSchedule {

  client: ClientProxy;

  constructor(
    private config: ConfigService,
  ) {
    super();

    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: this.config.get('REDIS_URI'),
      },
    });
  }

  private runJob(cmd, data = {}) {
    return this.client.send(cmd, data)
      .pipe(first())
      .subscribe();
  }

  @Cron('* * * * * *')
  async ping() {
    console.log('clock ping');
    this.runJob('ping');
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
