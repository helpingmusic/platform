/**
 * Vendor library wrappers that require api key
 */

import momentTZ from 'moment-timezone';
import { EnvConfig } from 'src/shared/config/env-config.interface';
import Stripe from 'stripe';

const env = (process.env as any) as EnvConfig;
/**
 * Stripe
 */
export const stripe = new Stripe(env.STRIPE_KEY);

/**
 * Moment Timezone
 */
momentTZ.tz.setDefault('America/Chicago');
export const moment = momentTZ;
