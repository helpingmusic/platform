import { Schema } from 'mongoose';

export const TrackSchema = new Schema({

  title: {
    type: String,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  href: {
    type: String,
  },

  tags: {
    type: [String],
    default: [],
  },

  // Length of the song in seconds
  duration: {
    type: Number,
  },

  filename: String,
  byteLength: Number,
  mediaType: String,

  s3: {
    key: {
      type: String,
    },

    ETag: {
      type: String,
    },

  },

  // for soft deletes
  deletedAt: {
    type: Date,
  },

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
