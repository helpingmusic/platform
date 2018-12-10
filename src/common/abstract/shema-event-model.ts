import { EventBus } from '@nestjs/cqrs';
import { Document, Schema } from 'mongoose';

export interface IModelChanges {
  [path: string]: any;
}

/**
 * Used to bind a mongoose schema hooks to events for the cqrs module
 */

export abstract class SchemaEventModel<T extends Document> {

  constructor(
    protected readonly schema: Schema,
    protected events$: EventBus,
  ) {
    this.bindHandlers();
  }

  private bindHandlers() {
    this.schema.pre('save', async function() {
      (this as any)._wasNew = this.isNew;

      (this as any)._changes = this.modifiedPaths()
        .reduce((agg, p) => ({ ...agg, [p]: this.get(p) }), {});
    });

    this.schema.post('save', (doc: any) => {
      if ((doc as any)._wasNew) {
        this.created(doc);
      } else {
        this.saved(doc, (doc as any)._changes);
      }
    });

    this.schema.post('remove', (doc: any) => this.removed(doc));
  }

  abstract created(doc: T): void;

  abstract saved(doc: T, changes: IModelChanges): void;

  abstract removed(doc: T): void;

}