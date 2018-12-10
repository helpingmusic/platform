import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateReferralCouponCommand } from 'src/users/commands/impl/create-referral-coupon.command';
import { stripe } from 'src/common/vendor';

@CommandHandler(CreateReferralCouponCommand)
export class CreateReferralCouponHandler implements ICommandHandler<CreateReferralCouponCommand> {

  constructor() {
  }

  async execute(cmd: CreateReferralCouponCommand, resolve: (value?) => void) {
    const { user } = cmd;

    const year = (new Date()).getFullYear().toString();

    const fn = user.first_name;
    const ln = user.last_name;

    // Used to auto generate a code based off a name
    const possibleCodes = [
      fn + year.substr(2),
      fn + year,
      fn[0] + ln + year.substr(2),
      fn[0] + ln + year,
      fn + ln + year.substr(2),
      fn + ln + year,
    ]
      .map(c => c.replace(' ', '').toLowerCase());

    /**
     * Recursive function to create unique coupon in stripe,
     *  If we run out of codes, an empty string will be passed
     *  and stripe will create a code for us.
     */
    const coupon = await (async function createCoupon(i) {
      try {
        return await stripe.coupons.create({
          id: possibleCodes[i],
          amount_off: 500,
          currency: 'usd',
          duration: 'once',
          metadata: {
            referrerId: String(user._id),
            name: user.name,
          },
        });
      } catch (e) { // coupon already exists
        return await createCoupon(i + 1);
      }
    }(0));

    user.set('referralCode', coupon.id);

    resolve();
  }

}