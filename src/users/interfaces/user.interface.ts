import { Document } from 'mongoose';
import { AuthProviders } from 'src/auth/auth-providers.enum';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { MembershipType } from 'src/common/constants';
import { IBilling } from 'src/users/interfaces/billing.interface';
import { INotificationSettings } from 'src/users/interfaces/notification-settings.interface';
import { IPushSubscription } from 'src/users/interfaces/push-subscription.interface';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phoneNumber: string;
  name: string;

  password: string;
  salt: string;

  role: UserRoles;
  provider: AuthProviders;
  google: { id: string; };
  facebook: { id: string; };

  city: string;
  state: string;
  profession: string;
  bio: string;

  membership_types: Array<MembershipType>;
  genres: Array<string>;
  instruments: Array<string>;
  skills: Array<string>;
  resources: Array<string>;

  profile_pic: string;
  banner: string;

  credits: number;

  personal_links: {
    [media: string]: string;
  };

  stripe: IBilling;
  active_until: Date;

  notifications: INotificationSettings;
  pushSubscriptions: Array<IPushSubscription>;

  referredBy: string;
  referralCode: string;
  couponUsed: boolean;
  emailConfirmed: boolean;
  last_active: Date;

  created_at: Date;
  updated_at: Date;

  /**
   * Virtuals
   */

  token: {
    _id: string;
    role: string;
    active_until: Date,
  };

  isActive: boolean;
  hasPassword: boolean;
}