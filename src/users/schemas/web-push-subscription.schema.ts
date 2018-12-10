import { Schema } from 'mongoose';

export const WebPushSubscriptionSchema = new Schema({
  endpoint: String,

  keys: {
    p256dh: String,
    auth: String,
  },
});