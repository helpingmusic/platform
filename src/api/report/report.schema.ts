import { Schema } from 'mongoose';
import { ReportStatus } from 'src/api/report/report-status.enum';

export const ReportSchema = new Schema({

  status: {
    type: String,
    default: ReportStatus.REPORTED,
  },

  // Item being reported
  media: {
    kind: String, // eg Post, Review, etc
    item: { type: Schema.Types.ObjectId, refPath: 'media.kind' },
  },

  reporter: {
    // User who reported
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  reason: {
    type: String,
    required: true,
  },

  statusReason: {
    // Admin explanation report status
    type: String,
  },

  // user note about the report
  description: {
    type: String,
  },

  resolved_at: {
    type: Date,
  },

}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },

  timestamps: {
    createdAt: 'opened_at',
    updatedAt: 'updated_at',
  },
});

// mark report as resolved when status is updated
ReportSchema.path('status').set(function(v: ReportStatus) {
  if (!this.isNew && v !== ReportStatus.REPORTED) {
    this.set({ resolved_at: new Date() });
  }
  return v;
});
