import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateStripeCustomerCommand } from 'src/users/commands/impl/create-stripe-customer.command';
import { stripe } from 'src/common/vendor';

@CommandHandler(CreateStripeCustomerCommand)
export class CreateStripeCustomerHandler implements ICommandHandler<CreateStripeCustomerCommand> {

  constructor() {
  }

  async execute(cmd: CreateStripeCustomerCommand, resolve: (value?) => void) {
    const { user } = cmd;

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      phone: user.phoneNumber,
      metadata: {
        _id: String(user._id),
      },
    } as any);

    user.set('stripe.customerId', customer.id);
    await user.save();

    resolve(customer);
  }

}