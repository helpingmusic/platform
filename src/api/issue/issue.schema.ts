import { Schema } from 'mongoose';
import { IssueTypes } from 'src/api/issue/issue-types.enum';

export const IssueSchema = new Schema({

  description: {
    type: String,
    required: true,
  },

  type: {
    // e.g. bug
    type: String,
    required: true,
    enum: { values: [IssueTypes.BUG, IssueTypes.SUGGESTION] },
  },

  closed_at: {
    type: Date,
  },

  submittedBy: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
}, {

  toObject: { virtuals: true },
  toJSON: { virtuals: true },

  timestamps: {
    createdAt: 'opened_at',
    updatedAt: 'updated_at',
  },
});

IssueSchema
  .virtual('isOpen')
  .get(function() {
    return !this.closed_at;
  });
