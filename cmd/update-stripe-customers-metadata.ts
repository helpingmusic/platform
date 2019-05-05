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
      console.log('try cust', user._id, user.get('stripe.customerId'));
      return stripe.customers.update(
        user.get('stripe.customerId'),
        {
          email: user.email,
          name: user.name,
          phone: user.phoneNumber,
          description: null,
          metadata: {
            _id: String(user._id),
            name: null,
          },
        } as any,
      )
        .catch((e) => {
          console.log('failed', user._id, user.get('stripe.customerId'));
          console.log(e);
        });
    }),
  );

};
