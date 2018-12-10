import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/users/services/users.service';
import { stripe } from 'src/common/vendor';
import { CreditMemberReferralCommand } from 'src/webhooks/stripe/commands/credit-member-referral.command';

@CommandHandler(CreditMemberReferralCommand)
export class CreditMemberReferralHandler implements ICommandHandler<CreditMemberReferralCommand> {

  constructor(private userService: UsersService) {
  }

  async execute(cmd: CreditMemberReferralCommand, resolve: (value?) => void) {
    const { discount } = cmd;

    const referrerId = discount.coupon.metadata.referrerId;

    const [referrer, referredUser] = await Promise.all([
      this.userService.getById(referrerId),
      this.userService.findOne({ 'stripe.customerId': discount.customer }),
    ]);

    // add to user stripe account
    await stripe.invoiceItems.create({
      customer: referrer.stripe.customerId,
      amount: -500, // credit referrer $5
      currency: 'usd',
      description: `Referral Credit from ${referredUser.first_name} ${referredUser.last_name}`,
      metadata: { referred: String(referredUser._id) },
    });

    resolve();
  }

}