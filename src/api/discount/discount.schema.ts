import { Schema } from 'mongoose';

export const DiscountSchema = new Schema({

  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
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
