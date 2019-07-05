import { INestApplicationContext } from '@nestjs/common';
import { LogService } from 'src/shared/logger/log.service';
import { Util } from './util';

export const UpdateCollaboratePrice = async (app: INestApplicationContext): Promise<any> => {
  const log = app.get<LogService>(LogService);
  const util = new Util(log);

  await util.createOrUpdate({
      currency: 'USD',
      interval: 'month',
      id: 'cowork-2',
      metadata: { tier: 'cowork' },
      product: { name: 'Collaborate' },
      amount: 20000,
      nickname: 'Collaborate',
  });

};
