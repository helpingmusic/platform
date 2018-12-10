import { Schema } from 'mongoose';

export const PostSchema = new Schema({

  // content of the post
  content: {
    type: String,
    required: true,
  },

  hidden: {
    // Whether the post is shown or not
    type: Boolean,
    default: false,
  },

  poster: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

PostSchema.methods = {
  // If post is reported and removed by admin,
  // Hide the post from public,
  remove() {
    this.set({ hidden: true });
    return this.save();
  },
  // show item to public
  show() {
    this.set({ hidden: false });
    return this.save();
  },
};

PostSchema.virtual('thread', {
  ref: 'Thread',
  localField: '_id',
  foreignField: 'media.item',
  justOne: true,
});
