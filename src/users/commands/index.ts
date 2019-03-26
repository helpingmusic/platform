import { ConfirmUserEmailHandler } from 'src/users/commands/handlers/confirm-user-email.handler';
import { CreateReferralCouponHandler } from 'src/users/commands/handlers/create-referral-coupon.handler';
import { CreateStripeCustomerHandler } from 'src/users/commands/handlers/create-stripe-customer.handler';
import { RemoveUserIndexHandler } from 'src/users/commands/handlers/remove-user-index.handler';
import { SendWelcomeEmailHandler } from 'src/users/commands/handlers/send-welcome-email.handler';
import { UpdateStripeCustomerHandler } from 'src/users/commands/handlers/update-stripe-customer.handler';
import { UpdateUserIndexHandler } from 'src/users/commands/handlers/update-user-index.handler';

export const CommandHandlers = [
  ConfirmUserEmailHandler,
  CreateReferralCouponHandler,
  CreateStripeCustomerHandler,
  RemoveUserIndexHandler,
  SendWelcomeEmailHandler,
  UpdateStripeCustomerHandler,
  UpdateUserIndexHandler,
];