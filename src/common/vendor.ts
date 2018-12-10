/**
 * Vendor library wrappers that require api key
 */

import momentTZ from 'moment-timezone';
import { EnvConfig } from 'src/shared/config/env-config.interface';
import Stripe from 'stripe';
import wp from 'web-push';
// import Raven from 'raven';

const env = (process.env as any) as EnvConfig;
/**
 * Stripe
 */
export const stripe = new Stripe(env.STRIPE_KEY);

/**
 * Webpush
 */
wp.setVapidDetails(
  'mailto:home@helpingmusic.org',
  env.WEB_PUSH_PUBLIC_KEY,
  env.WEB_PUSH_PRIVATE_KEY,
);
export const webpush = wp;

/**
 * Moment Timezone
 */
momentTZ.tz.setDefault('America/Chicago');
export const moment = momentTZ;
