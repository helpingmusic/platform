import { Injectable } from '@nestjs/common';
import { CreditTransactionService } from 'src/api/credit-transaction/credit-transaction.service';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';
import { MembershipTiers, plans } from 'src/common/constants';
import { BadDataException } from 'src/common/exceptions/bad-data.exception';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';
import { IBilling } from 'src/users/interfaces/billing.interface';
import { stripe } from 'src/common/vendor';
import * as Stripe from 'stripe';
import { ICard, IStripeError } from 'stripe';
import { IUser } from 'src/users/interfaces/user.interface';
import ISubscription = Stripe.subscriptions.ISubscription;

@Injectable()
export class UsersBillingService {

  log: ILogger;

  constructor(
    log: LogService,
    private creditService: CreditTransactionService,
  ) {
    this.log = log.createLogger('billing');
  }

  /**
   * Set user's stripe token
   * @param source - stripe token id
   * @returns {Promise}
   */
  async setToken(user: IUser, source: string) {
    let card: ICard;
    try {
      const res = await stripe.customers.update(user.stripe.customerId, { source });
      card = res.sources.data[0] as ICard;
    } catch (e) {
      throw new BadDataException({
        field: 'payment',
        message: e.message,
      });
    }

    user.stripe.set('card', {
      id: card.id,
      brand: card.brand,
      last4: card.last4,
      expMonth: card.exp_month,
      expYear: card.exp_year,
    });

    await user.save();

    return user.stripe;
  }

  /**
   *  Apply coupon to user
   *  @param  {String} coupon code to apply
   */
  async applyCoupon(user: IUser, code: string) {
    if (!code) return;

    // Users can only apply one coupon
    if (user.couponUsed) return false;
    try {
      var coup = await stripe.coupons.retrieve(code);
    } catch (e) { /* No coupon found */
    }

    if (!coup) return;

    // Coupon is not valid or not found
    if (!coup.valid) return false;

    // Coupon can't be one's own
    if (coup.metadata.referrerId === user._id) return false;

    const customer = await stripe.customers.update(
      user.stripe.customerId,
      { coupon: code },
    );

    user.set('stripe.couponUsed', code);
    if (customer.discount.end) {
      const coupEnd = new Date(customer.discount.end * 1000);
      user.set('stripe.couponEnd', coupEnd);

      if (coupEnd > user.active_until) {
        user.set('active_until', coupEnd);
      }
    }

    return user.save();
  }

  async updateSubscription(user: IUser, tier: MembershipTiers): Promise<IBilling> {
    const plan = plans[tier];

    if (user.stripe.plan === plan.id) return user.stripe;

    let subscription: ISubscription;
    if (!user.stripe.subscriptionId) {
      //  Doesn't have subscription to update yet, so create
      subscription = await stripe.subscriptions.create({
        customer: user.stripe.customerId,
        items: [{ plan: plan.id }],
      });
    } else {
      const curSubscription = await stripe.subscriptions.retrieve(user.stripe.subscriptionId);
      subscription = await stripe.subscriptions.update(user.stripe.subscriptionId, {
        items: [{
          id: curSubscription.items.data[0].id,
          plan: plan.id,
        }],
      });
    }

    user.set({
      'stripe.plan': plan.id,
      'stripe.tier': tier,
      'stripe.subscriptionId': subscription.id,
      'stripe.status': subscription.status,
      'stripe.periodEnd': new Date(subscription.current_period_end * 1000),
      'active_until':  new Date(subscription.current_period_end * 1000),
    });

    await user.save();
    return user.stripe;
  }

  async charge(user: IUser, items, invoiceOptions) {
    // Create invoice
    await Promise.all(items.map(i => {
      const invoiceItem = Object.assign({}, i, {
        customer: user.stripe.customerId,
        currency: 'usd',
        // so customer discounts meant for subscriptions won't apply
        discountable: false,
      });
      return stripe.invoiceItems.create(invoiceItem);
    }));

    const inv = Object.assign({}, {
      customer: user.stripe.customerId,
    }, invoiceOptions);

    /**
     * Apply user credits
     */
    let transaction;
    if (user.credits > 0) {
      const due = items.map(i => i.amount) / 100;
      const applicableAmount = user.credits > due ? due : user.credits;

      try {
        transaction = await this.creditService.create({
          user: user._id,
          endAmount: user.credits - applicableAmount,
          type: TransactionTypes.CREDIT_REDEEM,
        });
        await stripe.invoiceItems.create({
          customer: user.stripe.customerId,
          currency: 'usd',
          amount: -(applicableAmount * 100),
          description: 'HOME Member Credits',
          metadata: { 'credit-transaction': String(transaction._id) },
        });
      } catch (e) {
        this.log.error(e);
      }
    }

    const invoice = await stripe.invoices.create(inv);

    if (transaction) {
      const creditsItem = invoice.lines.data.find(i => transaction.id === i.metadata['credit-transaction']);
      if (creditsItem) {
        await this.creditService.update(transaction, { 'metadata.invoice': invoice.id });
      }
    }

    await stripe.invoices.pay(invoice.id);
    return invoice;
  }

  async addAccountCredit(user: IUser, amount: number) {
    // Only charge if commitment is above the stripe minimum (50 cents)
    if (amount < 50) return;
    // Charge member what they wanted to commit
    const charge = await stripe.charges.create({
      customer: user.stripe.customerId,
      amount,
      currency: 'usd',
    });

    // Update member's account balance to reflect charge
    const customer = await stripe.customers.retrieve(user.stripe.customerId);
    const newBalance = (customer.account_balance || 0) - charge.amount;
    await stripe.customers.update(user.stripe.customerId, {
      account_balance: newBalance,
    });

    return charge;
  }

  async getInvoices(user: IUser): Promise<any> {
    const pastInvoices = await stripe.invoices.list({
      customer: user.stripe.customerId,
      limit: 100,
      expand: ['data.charge'],
    });

    const invoices = pastInvoices.data;

    try {
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming(user.stripe.customerId);
      invoices.unshift(upcomingInvoice);
    } catch (e) { /* No Upcoming Invoice */ }

    return invoices;
  }

  async cancelSubscription(user: IUser): Promise<IBilling> {
    const sub = await stripe.subscriptions.del(
      user.stripe.subscriptionId,
      { at_period_end: true },
    );

    user.set({ 'stripe.status': sub.status });
    await user.save();

    return user.stripe;
  }

}
