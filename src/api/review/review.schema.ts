import { Schema } from 'mongoose';

export const ReviewSchema = new Schema({

  content: {
    /* Optional note about review */
    type: String,
  },

  rating: {
    /* Rating out out 5 */
    type: Number,
    required: true,
  },

  hidden: {
    // Whether the post is shown or not
    type: Boolean,
    default: false,
  },

  poster: {
    /* Wrote the review */
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  reviewee: {
    /* Reviewed about */
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

}, {

  toObject: { virtuals: true },
  toJSON: { virtuals: true },

  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

ReviewSchema.methods = {
  // If review is reported and removed by admin,
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
