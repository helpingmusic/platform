import { LogService } from 'src/shared/logger/log.service';
import { stripe } from 'src/common/vendor';
import { ILogger } from 'src/shared/logger/logger.interface';

export class Util {

  log: ILogger;

  constructor(logService: LogService) {
    this.log = logService.createLogger('stripe-migrate');
  }

  async createOrUpdate(plan) {
    this.log.info(`create or update ${plan.id}`);

    let planExists = true;

    await stripe.plans.retrieve(plan.id)
      .catch(() => planExists = false);

    if (planExists) {
      this.log.info(`updating ${plan.id}`);
      await stripe.plans.update(plan.id, {
        metadata: plan.metadata,
        nickname: plan.nickname,
      });
    } else {
      this.log.info(`creating ${plan.id}`);
      await stripe.plans.create(plan);
    }

  }
}
