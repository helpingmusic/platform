import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { registerAnnouncementFactory } from 'fixtures/factory/factories/announcement.factory';
import { registerUserFactory } from 'fixtures/factory/factories/user.factory';
import { Connection } from 'mongoose';
import { factory, MongooseAdapter } from 'factory-girl';
import { AnnouncementSchema } from 'src/api/announcement/announcement.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

@Injectable()
export class FactoryService {

  private readonly factory;

  constructor(
    @InjectConnection() private conn: Connection,
  ) {
    this.factory = factory;
    this.factory.setAdapter(new MongooseAdapter());

    this.registerFactories();
  }

  private registerFactories() {
    registerUserFactory(this.conn.model('User', UserSchema, 'users'), this.factory);
    registerAnnouncementFactory(this.conn.model('Announcement', AnnouncementSchema, 'announcements'), this.factory);
  }

  /**
   * Wrapping the Factory Girl library to keep type hints
   */

  cleanUp(): Promise<any> {
    return this.factory.cleanUp().catch();
  }

  attrs<T>(model: string, attrs?: Partial<T>, options?: any): Promise<Partial<T>> {
    return this.factory.attrs(model, attrs, options);
  }

  attrsMany<T>(model: string, count: number | Partial<T>[], attrs?: Partial<T> | any, options?: any): Promise<Partial<T>[]> {
    if (Array.isArray(count)) {
      return this.factory.attrsMany(model, count, attrs);
    }
    return this.factory.attrsMany(model, count, attrs, options);
  }

  build<T>(model: string, attrs?: Partial<T>, options?: any): Promise<T> {
    return this.factory.build(model, attrs, options);
  }

  buildMany<T>(model: string, count: number | Partial<T>[], attrs?: Partial<T> | any, options?: any): Promise<T[]> {
    if (Array.isArray(count)) {
      return this.factory.buildMany(model, count, attrs);
    }
    return this.factory.buildMany(model, count, attrs, options);
  }

  create<T>(model: string, attrs?: Partial<T>, options?: any): Promise<T> {
    return this.factory.create(model, attrs, options);
  }

  createMany<T>(model: string, count: number | Partial<T>[], attrs?: Partial<T> | any, options?: any): Promise<T[]> {
    if (Array.isArray(count)) {
      return this.factory.createMany(model, count, attrs);
    }
    return this.factory.createMany(model, count, attrs, options);
  }

}