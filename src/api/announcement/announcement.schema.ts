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

  cmsId: String,

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
