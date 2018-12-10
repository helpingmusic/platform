import { CreditMemberReferralHandler } from 'src/webhooks/stripe/commands/credit-member-referral.handler';
import { SendFailedPaymentEmailHandler } from 'src/webhooks/stripe/commands/send-failed-payment-email.handler';
import { SendUserInvoiceHandler } from 'src/webhooks/stripe/commands/send-user-invoice.handler';
import { SyncCreditCardHandler } from 'src/webhooks/stripe/commands/sync-credit-card.handler';
import { SyncCustomerHandler } from 'src/webhooks/stripe/commands/sync-customer.handler';
import { SyncStripeSubscriptionHandler } from 'src/webhooks/stripe/commands/sync-stripe-subscription.handler';

export const CommandHandlers = [
  CreditMemberReferralHandler,
  SendFailedPaymentEmailHandler,
  SendUserInvoiceHandler,
  SyncCreditCardHandler,
  SyncCustomerHandler,
  SyncStripeSubscriptionHandler,
];
