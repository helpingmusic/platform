import { Schema } from 'mongoose';

export const UserNotificationSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  readAt: Date,

});

UserNotificationSchema.virtual('read')
  .get(function() {
    return this.readAt !== null;
  })
  .set(function(r: boolean) {
    this.readAt = r ? new Date() : null;
  });