import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStripeCustomerCommand } from 'src/users/commands/impl/update-stripe-customer.command';
import { stripe } from 'src/common/vendor';

@CommandHandler(UpdateStripeCustomerCommand)
export class UpdateStripeCustomerHandler implements ICommandHandler<UpdateStripeCustomerCommand> {

  constructor() {
  }

  async execute(cmd: UpdateStripeCustomerCommand, resolve: (value?) => void) {
    const { user } = cmd;

    const cust = await stripe.customers.update(
      user.get('stripe.customerId'),
      {
        email: user.email,
        name: user.name,
        phone: user.phoneNumber,
        metadata: {
          '_id': String(user._id),
          'First Name': user.first_name,
          'Last Name': user.last_name,
        },
      } as any,
    );

    resolve(cust);
  }

}