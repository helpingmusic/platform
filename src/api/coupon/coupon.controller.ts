import { Controller, Get, Query } from '@nestjs/common';
import { stripe } from 'src/common/vendor';
import Stripe = require('stripe');

@Controller('coupons')
export class CouponController {

  stripe: Stripe;

  constructor() {
    this.stripe = stripe;
  }

  /**
   * Validate coupon code
   * @param code
   */
  @Get('validate')
  async validate(@Query('code') code: string) {
    let coupon;

    try {
      coupon = await this.stripe.coupons.retrieve(code);
    } catch (err) { // no coupon
      return { id: code, valid: false };
    }

    return {
      id: coupon.id,
      valid: coupon.valid,
      amount_off: coupon.amount_off,
      percent_off: coupon.percent_off,
      duration_in_months: coupon.duration_in_months,
      duration: coupon.duration,
    };

  }

}
