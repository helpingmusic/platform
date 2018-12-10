import { Schema } from 'mongoose';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';

export const NotificationSettingsSchema = new Schema({

  [NotificationTypes.APPLICATION]: {
    browser: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
  },

  [NotificationTypes.ACCOUNT]: {
    browser: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
  },

  [NotificationTypes.DISCOUNT]: {
    browser: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
  },

  [NotificationTypes.EVENT]: {
    browser: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
  },

  [NotificationTypes.POST]: {
    browser: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
  },

  [NotificationTypes.ANNOUNCEMENT]: {
    browser: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
  },

  [NotificationTypes.REVIEW]: {
    browser: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
  },

});