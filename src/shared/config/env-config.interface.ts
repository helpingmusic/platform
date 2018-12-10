export interface EnvConfig {
  NODE_PATH: string;
  NODE_ENV: string;
  DEBUG: string;

  DOMAIN: string;
  APP_ORIGIN: string;
  SESSION_SECRET: string;
  TZ: string;

  DB_URI: string;
  REDIS_URI: string;

  STRIPE_KEY: string;
  STRIPE_PUB_KEY: string;

  FACEBOOK_ID: string;
  FACEBOOK_SECRET: string;

  GOOGLE_ID: string;
  GOOGLE_SECRET: string;

  GOOGLE_SA_EMAIL: string;
  GOOGLE_SA_PKEY: string;

  AWS_ACCESS_KEY: string;
  AWS_SECRET_ACCESS_KEY: string;

  MAILCHIMP_KEY: string;
  MANDRILL_KEY: string;

  ALGOLIA_APP_ID: string;
  ALGOLIA_ADMIN_KEY: string;
  ALGOLIA_SEARCH_KEY: string;
  ALGOLIASEARCH_APPLICATION_ID: string;
  ALGOLIASEARCH_API_KEY: string;
  ALGOLIASEARCH_API_KEY_SEARCH: string;

  WEB_PUSH_PUBLIC_KEY: string;
  WEB_PUSH_PRIVATE_KEY: string;
}