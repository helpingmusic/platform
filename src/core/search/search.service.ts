import { Injectable } from '@nestjs/common';
import algoliasearch, { Client, Index } from 'algoliasearch';
import { classToPlain } from 'class-transformer';
import { ConfigService } from 'src/shared/config/config.service';
import { Indices } from 'src/core/search/indices.enum';
import { IRecord } from 'src/core/search/record.interface';

@Injectable()
export class SearchService {

  private client: Client;
  private indices = new Map<Indices, Index>();

  constructor(
    private config: ConfigService,
  ) {
    this.client = algoliasearch(
      config.get('ALGOLIA_APP_ID'),
      config.get('ALGOLIA_ADMIN_KEY'),
    );

    // init each index
    this.indices.set(Indices.USERS, this.client.initIndex(Indices.USERS));
  }

  /**
   * Upsert items for index
   * @param indexKey {Indices}
   * @param items
   */
  upsertRecords(indexKey: Indices, items: Array<IRecord>) {
    const index = this.indices.get(indexKey);

    const clean = items.map(i => classToPlain(i, { strategy: 'excludeAll' }));

    return new Promise((resolve, reject) => {
      index.saveObjects(clean, (err, task) => {
        if (err) reject(err);
        resolve(task);
      });
    });
  }

  deleteRecords(indexKey: Indices, objectIds: Array<string>) {
    const index = this.indices.get(indexKey);

    return new Promise((resolve, reject) => {
      index.deleteObjects(objectIds, (err, task) => {
        if (err) reject(err);
        resolve(task);
      });
    });
  }

}
