import { Schema } from 'mongoose';

export const CommentSchema = new Schema({

  // thread which comment belongs
  thread: { ref: 'Thread', type: Schema.Types.ObjectId },
  // Parent comment
  parent: { ref: 'Comment', type: Schema.Types.ObjectId },
  commenter: { ref: 'User', type: Schema.Types.ObjectId },

  body: {
    type: String,
    required: true,
  },

  removedAt: {
    type: Date,
    default: null,
  },

}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});
