import { INestApplicationContext } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { stripe } from 'src/common/vendor';
import { IUser } from 'src/users/interfaces/user.interface';

export const UpdateStripeCustomersMetadata = async (app: INestApplicationContext): Promise<any> => {
  const User = app.get<Model<IUser>>(getModelToken('User'));
  const users = await User.find().exec();

  await Promise.all(
    users.map((user) => {
      return stripe.customers.update(
        user.get('stripe.customerId'),
        {
          email: user.email,
          name: user.name,
          phone: user.phoneNumber,
          description: null,
          metadata: {
            '_id': String(user._id),
            'name': null,
            'First Name': user.first_name,
            'Last Name': user.last_name,
          },
        } as any,
      )
        .catch((e) => {
        });
    }),
  );

};
