import { Expose, Type } from 'class-transformer';
import { Document } from 'mongoose';
import { IRecord } from 'src/search/record.interface';

export abstract class SearchRecord implements IRecord {

  @Expose()
  @Type(() => String)
  _id: string;

  @Expose()
  get objectID(): string {
    return String(this._id);
  }

  constructor(body: Document) {
    Object.assign(this, body.toObject());
  }

}