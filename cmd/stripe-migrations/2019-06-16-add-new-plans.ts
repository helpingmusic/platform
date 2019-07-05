import { INestApplicationContext } from '@nestjs/common';
import { LogService } from 'src/shared/logger/log.service';
import { Util } from './util';

export const AddNewStripePlans = async (app: INestApplicationContext): Promise<any> => {
  const log = app.get<LogService>(LogService);
  const util = new Util(log);

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

  await Promise.all(newPlans.map(p => util.createOrUpdate(p)));

};
