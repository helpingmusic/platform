import { Schema } from 'mongoose';
import { VideoTypes } from 'src/api/video/video-types.enum';

export const VideoSchema = new Schema({

  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
    enum: {
      values: [VideoTypes.STREAM, VideoTypes.YOUTUBE, VideoTypes.VIMEO],
    },
  },

  // Whether or not video is live
  publish: {
    type: Boolean,
    default: true,
  },

  url: {
    type: String,
    // required: true,
  },

  mediumId: {
    // Id of media on medium using
    // eg from a youtube url "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    // "dQw4w9WgXcQ" would be the medium id
    type: String,
  },
}, {

  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});
