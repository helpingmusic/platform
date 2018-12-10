import { Document } from 'mongoose';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';

// notifiable mediums
export interface INotificationSetting {
  browser: boolean;
  email: boolean;
}

export interface INotificationSettings extends Document {

  [NotificationTypes.APPLICATION]: INotificationSetting;
  [NotificationTypes.ACCOUNT]: INotificationSetting;
  [NotificationTypes.DISCOUNT]: INotificationSetting;
  [NotificationTypes.EVENT]: INotificationSetting;
  [NotificationTypes.POST]: INotificationSetting;
  [NotificationTypes.ANNOUNCEMENT]: INotificationSetting;
  [NotificationTypes.REVIEW]: INotificationSetting;

}