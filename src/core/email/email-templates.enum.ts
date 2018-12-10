export enum EmailTemplates {
  ADMIN_MESSAGE = 'admin.message',
  ADMIN_NOTIFY = 'admin.notify',

  CONFIRM_ACCOUNT = 'user.confirm_account',
  UPDATE_EMAIL = 'user.update_email',
  FORGOT_PASSWORD = 'user.forgot_password',
  NOTIFICATION = 'user.notification',
  QUICK_SIGNUP = 'user.quick_signup',

  TRIAL_ENDING = 'stripe.trial_ending',
  MEMBERSHIP_CANCELLED = 'stripe.membership_cancelled',
  FAILED_PAYMENT = 'stripe.failed_payment',
  INVOICE = 'stripe.invoice',
}