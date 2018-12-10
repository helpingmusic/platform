import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import * as val from 'mongoose-validators';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { AuthProviders } from 'src/auth/auth-providers.enum';
import * as constants from 'src/common/constants';
import { PASSWORD_SALT_ROUNDS } from 'src/users/constants';
import { UserBillingSchema } from 'src/users/schemas/billing.schema';
import { NotificationSettingsSchema } from 'src/users/schemas/notification-settings.schema';
import { WebPushSubscriptionSchema } from 'src/users/schemas/web-push-subscription.schema';
import { moment } from 'src/common/vendor';

const { membershipTiers, authTypes } = constants;

export const UserSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },

  email: {
    type: String,
    lowercase: true,
    required() {
      // Only need email if no provider
      return this.providers.some(p => p === 'local');
    },
    validate: [val.isEmail()],
  },
  emailConfirmed: {
    type: Boolean,
  },

  phoneNumber: {
    type: String,
  },

  role: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
  },
  salt: String,
  provider: {
    type: String,
    default: AuthProviders.LOCAL,
  },

  membership_types: {
    type: [String],
    default: [],
  },

  referredBy: String,

  city: { type: String },
  state: { type: String },

  profession: { type: String },
  bio: { type: String },
  genres: {
    type: [String],
    default: [],
  },
  instruments: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  resources: {
    // Access to venues, studios, equipment, etc
    type: [String],
    default: [],
  },

  profile_pic: { type: String },
  banner: { type: String },

  credits: {
    type: Number,
    default: 0,
    get(v) {
      return v || 0;
    },
  },

  stripe: {
    type: UserBillingSchema,
    default: {},
  },

  personal_links: {
    site: { type: String, set: (v) => v || null },
    facebook: { type: String, set: (v) => v || null},
    twitter: { type: String, set: (v) => v || null},
    linkedin: { type: String, set: (v) => v || null},
    youtube: { type: String, set: (v) => v || null},
    soundcloud: { type: String, set: (v) => v || null},
    instagram: { type: String, set: (v) => v || null},
    spotify: { type: String, set: (v) => v || null},
  },

  referralCode: {
    type: String,
  },

  last_active: {
    type: Date,
    default: () => new Date(),
  },
  active_until: {
    type: Date,
    default: () => new Date(),
  },

  applyToPA: {
    type: Boolean,
  },

  facebook: {
    type: Object,
    default: {},
  },
  google: {
    type: Object,
    default: {},
  },

  notifications: NotificationSettingsSchema,

  pushSubscriptions: [WebPushSubscriptionSchema],

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  usePushEach: true,
});

/**
 * Virtuals
 */
UserSchema
  .virtual('plan')
  .get(function() {
    return this.stripe.plan;
  });
UserSchema
  .virtual('hasPassword')
  .get(function() {
    return !!this.password;
  });

UserSchema
  .virtual('name')
  .get(function() {
    return this.first_name + ' ' + this.last_name;
  });

UserSchema
  .virtual('providers')
  .get(function() {
    const providers = [];
    if (this.password || this.provider === 'local') providers.push('local');
    if (this.google && this.google.id) providers.push('google');
    if (this.facebook && this.facebook.id) providers.push('facebook');
    return providers;
  });

/**
 * Public profile and private user info
 */
UserSchema
  .virtual('me')
  .get(function() {
    const data = {
      credits: this.credits,
      stripe: this.stripe,
      pushSubscriptions: this.pushSubscriptions,
      referralCode: this.referralCode,
      phoneNumber: this.phoneNumber,
    };
    Object.assign(data, this.profile);
    return data;
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      _id: this._id,
      role: this.role,
      active_until: this.active_until,
    };
  });

UserSchema
  .virtual('profileComplete')
  .get(function() {
    return this.stripe && this.stripe.subscriptionId && !!this.membership_types.length;
  });

UserSchema
  .virtual('name')
  .get(function() {
    return this.first_name + ' ' + this.last_name;
  });

// Determine whether user account has active subscription
UserSchema
  .virtual('isActive')
  .get(function() {
    if (this.stripe.status === 'canceled') return false;

    if (this.active_until) {
      return moment().isBefore(this.active_until) && this.profileComplete;
    }
    return false;
  });

/**
 * Validations
 */
// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    if (authTypes.some(t => this.providers.indexOf(t) !== -1)) {
      return true;
    }
    // allow no password via quicksignup
    if (!password) return true;
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
// UserSchema
//   .path('email')
//   .validate(async function(email, cb) {
//     return cb(true);
//
//     const self = this;
//     if (!email) return cb(true);
//
//     const otherUser = await this.constructor.findOne({ email }).exec();
//
//     if (otherUser) {
//       if (self.id === otherUser.id) {
//         return cb(true);
//       }
//       return cb(false);
//     }
//     return cb(true);
//
//   }, 'The specified email address is already in use.');

// Hash password
UserSchema
  .pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const password = await bcrypt.hash(this.get('password'), PASSWORD_SALT_ROUNDS);
    this.set({ password });
    next();
  });
