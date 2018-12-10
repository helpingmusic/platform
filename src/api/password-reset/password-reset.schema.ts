import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { moment } from 'src/common/vendor';

export const PasswordResetSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // token hash
  token: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    // expires after 24 hours
    default: moment().add(24, 'hours').toDate(),
  },

  usedAt: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true,
});

PasswordResetSchema.pre('save', async function() {
  this.set({
    token: await bcrypt.hash(this.get('token'), 10),
  });
});
