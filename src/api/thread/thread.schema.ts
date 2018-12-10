import { Schema } from 'mongoose';

export const ThreadSchema = new Schema({

  // makes the model that can be commented on, dynamic
  media: {
    kind: String,
    item: {
      type: Schema.Types.ObjectId,
      refPath: 'media.kind',
    },
  },

  // If thread is open to comment on
  locked: {
    kind: Boolean,
    default: false,
  },

}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ThreadSchema.virtual('_comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'thread',
  justOne: false,
});

ThreadSchema.virtual('comments')
  .get(function() {
    // Query will load with all comments inline
    // this should find the parent and attach the child to it.
    // Then remove all child comments from array
    // (takes advantage of the fact js passes objects by ref)

    return [].concat(this._comments || [])
      .map(com => {
        // cast comment to object b/c mongoose won't let us assign values otherwise
        const c = com.toObject();
        c.children = c.children || [];
        return c;
      })
      .map((c, i, arr) => {
        if (c.parent) {
          // attach child comment to parent comment
          const parent = arr.findIndex(p => p._id.equals(c.parent));
          arr[parent].children.push(c);
        }
        return c;
      })
      .filter(c => !c.parent); // filter out child comments from top level comments
  });

