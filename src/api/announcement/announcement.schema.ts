import { Schema } from 'mongoose';

export const AnnouncementSchema = new Schema({

  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
