import { Inject } from '@nestjs/common';
import {  } from '@nestjs/core';
import algoliasearch, { Client, Index } from 'algoliasearch';
import { ConfigService } from 'src/shared/config/config.service';

export interface IAlgoliaClient extends Client {
}

export const AlgoliaToken = 'AlgoliaClient';

export const AlogliaClient = {
  provide: AlgoliaToken,
  useFactory: (config: ConfigService) => {
    console.log('algolia config');
    return algoliasearch(
      config.get('ALGOLIA_APP_ID'),
      config.get('ALGOLIA_ADMIN_KEY'),
    );
  },
  inject: [ConfigService],
};
