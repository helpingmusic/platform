import { Injectable } from '@nestjs/common';
import { EventObservable, ICommand } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CreditMemberReferralCommand } from 'src/webhooks/stripe/commands/credit-member-referral.command';
import { SendFailedPaymentEmailCommand } from 'src/webhooks/stripe/commands/send-failed-payment-email.command';
import { SendUserInvoiceCommand } from 'src/webhooks/stripe/commands/send-user-invoice.command';
import { SyncCreditCardCommand } from 'src/webhooks/stripe/commands/sync-credit-card.command';
import { SyncCustomerCommand } from 'src/webhooks/stripe/commands/sync-customer.command';
import { SyncStripeSubscriptionCommand } from 'src/webhooks/stripe/commands/sync-stripe-subscription.command';
import { StripeEvents } from 'src/webhooks/stripe/stripe-events.enum';
import { StripeEvent } from 'src/webhooks/stripe/stripe.event';
import { coupons } from 'stripe';

@Injectable()
export class StripeSagas {

  /**
   * Sync users's stripe customer data
   */
  syncCustomer = (events$: EventObservable<StripeEvent>): Observable<ICommand> => (
    events$.ofType(StripeEvent)
      .pipe(
        filter(e => e.payload.object === 'customer'),
        map(e => new SyncCustomerCommand(e.payload)),
      )
  );

  /**
   * Sync users's stripe subscription data
   */
  syncSubscription = (events$: EventObservable<StripeEvent>): Observable<ICommand> => (
    events$.ofType(StripeEvent)
      .pipe(
        filter(e => e.payload.object === 'subscription'),
        map(e => new SyncStripeSubscriptionCommand(e.payload)),
      )
  );

  /**
   * Sync users's credit card
   */
  syncCard$ = (events$: EventObservable<StripeEvent>): Observable<ICommand> => (
    events$.ofType(StripeEvent)
      .pipe(
        filter(e => e.payload.object === 'card'),
        map(e => new SyncCreditCardCommand(e.payload)),
      )
  );

  /**
   * Credit a member for referring another member to HOME
   */
  creditReferrer = (events$: EventObservable<StripeEvent>): Observable<ICommand> => (
    events$.ofType(StripeEvent)
      .pipe(
        filter(e => e.type === StripeEvents.CUSTOMER_DISCOUNT_CREATED),
        // confirm there is a referrer id on coupon, that marks that a referral coupon was used
        filter(({ payload }: { payload: coupons.IDiscount }) => !!payload.coupon.metadata.referrerId),
        map(e => new CreditMemberReferralCommand(e.payload)),
      )
  );

  /**
   * Send member invoice
   */
  sendInvoice = (events$: EventObservable<StripeEvent>): Observable<ICommand> => (
    events$.ofType(StripeEvent)
      .pipe(
        filter(e => e.type === StripeEvents.INVOICE_CREATED),
        map(e => new SendUserInvoiceCommand(e.payload)),
      )
  );

  /**
   * Send user failed payment email
   */
  sendFailedPayment = (events$: EventObservable<StripeEvent>): Observable<ICommand> => (
    events$.ofType(StripeEvent)
      .pipe(
        filter(e => e.type === StripeEvents.INVOICE_PAYMENT_FAILED),
        map(e => new SendFailedPaymentEmailCommand(e.payload)),
      )
  );

  sagas = [
    this.syncCustomer,
    this.syncSubscription,
    this.creditReferrer,
    this.sendInvoice,
    this.sendFailedPayment,
    this.syncCard$,
  ];

}