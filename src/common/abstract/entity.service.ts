import { Injectable, NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';

/**
 * Abstract class for basic entities that need crud operations
 */

@Injectable()
export class EntityService<T extends Document> {

  PAGE_SIZE = 15;

  constructor(protected readonly model: Model<T>) {
  }

  index(): Promise<Array<T>> {
    return this.find();
  }

  paginate(query: any = {}, page: number): Promise<Array<T>> {
    return this.model.find(query)
      .sort('-created_at')
      .skip(page * this.PAGE_SIZE)
      .limit(this.PAGE_SIZE)
      .exec();
  }

  find(where: any = {}): Promise<Array<T>> {
    return this.model.find(where).exec();
  }

  show(id: string): Promise<T> {
    return this.model.findById(id).exec();
  }

  create(body: Partial<T>): Promise<T> {
    return this.model.create(body);
  }

  async update(id: string | T, body: any): Promise<T> {
    const doc = (typeof id === 'string') ? await this.show(id) : id;
    if (!doc) throw new NotFoundException();
    doc.set(body);
    return doc.save();
  }

  delete(id: string): Promise<any> {
    return this.model.findByIdAndDelete(id).exec();
  }

}
