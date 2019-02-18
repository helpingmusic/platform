import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { UserNotificationSchema } from 'src/api/notifications/schemas/user-notification.schema';
import { Schema } from 'mongoose';

export const NotificationSchema = new Schema({

  type: {
    type: String,
    enum: {
      values: Object.keys(NotificationTypes)
        .map(k => NotificationTypes[k]),
    },
  },

  users: [UserNotificationSchema],

  title: {
    type: String,
  },

  description: {
    type: String,
  },

  link: {
    // Link to relevant page in the app
    type: String,
    default: '/',
  },

  // any extra data that may vary between notifications
  data: {
    type: Object,
    default: {
      /*fromUser: userId*/
    },
  },

}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

NotificationSchema.methods = {

  // Get public version of notification for given user
  getForUser(userId) {
    const user = this.users.find(u => u.user.equals(userId));
    return {
      _id: this._id,
      type: this.type,
      read: user.read,
      readAt: user.readAt,
      description: this.description,
      title: this.title,
      link: this.link,
      data: this.data,
      createdAt: this.createdAt,
    };
  },

};
