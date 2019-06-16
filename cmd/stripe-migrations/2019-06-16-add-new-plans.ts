import { INestApplicationContext } from '@nestjs/common';
import { stripe } from 'src/common/vendor';
import { LogService } from 'src/shared/logger/log.service';

export const AddNewStripePlans = async (app: INestApplicationContext): Promise<any> => {
  const log = app.get<LogService>(LogService).createLogger('stripe-migrate');

  const createOrUpdate = async (plan) => {
    log.info(`create or update ${plan.id}`);

    let planExists = true;

    await stripe.plans.retrieve(plan.id)
      .catch(() => planExists = false);

    if (planExists) {
      log.info(`updating ${plan.id}`);
      await stripe.plans.update(plan.id, {
        metadata: plan.metadata,
        nickname: plan.nickname,
      });
    } else {
      log.info(`creating ${plan.id}`);
      await stripe.plans.create(plan);
    }

  };

  const newPlans = [
    {
      currency: 'USD',
      interval: 'month',
      id: 'creative-1',
      metadata: { tier: 'creative' },
      product: { name: 'Connect' },
      amount: 5000,
      nickname: 'Connect',
    },
    {
      currency: 'USD',
      interval: 'month',
      id: 'create-1',
      metadata: { tier: 'cowrite' },
      product: { name: 'Create' },
      amount: 10000,
      nickname: 'Create',
    },
    {
      currency: 'USD',
      interval: 'month',
      id: 'cowork-1',
      metadata: { tier: 'cowork' },
      product: { name: 'Collaborate' },
      amount: 15000,
      nickname: 'Collaborate',
    },
    {
      currency: 'USD',
      interval: 'year',
      id: 'producer-1',
      metadata: { tier: 'production' },
      product: { name: 'Producer' },
      amount: 100000,
      nickname: 'Producer 1',
    },
    {
      currency: 'USD',
      interval: 'year',
      id: 'pro-1',
      metadata: { tier: 'pro' },
      product: { name: 'Pro' },
      amount: 250000,
      nickname: 'Pro',
    },
    {
      currency: 'USD',
      interval: 'year',
      id: 'team-1',
      metadata: { tier: 'team' },
      product: { name: 'Team' },
      amount: 500000,
      nickname: 'Team',
    },
  ];

  await Promise.all(newPlans.map(createOrUpdate));

};
