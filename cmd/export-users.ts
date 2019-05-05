import { INestApplicationContext } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { toCSV } from 'cmd/util';
import { Model } from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

export const ExportUsers = async (app: INestApplicationContext): Promise<any> => {
  const User = app.get<Model<IUser>>(getModelToken('User'));

  const users = await User.find()
    .sort('-created_at')
    .exec();

  const usersFormatted = users.map(u => ({
    'ID': u.id,
    'First Name': u.first_name,
    'Last Name': u.last_name,
    'Email': u.email,
    'Phone Number': u.phoneNumber || '',
    'Membership Types': u.membership_types.join(', '),
    'Location': `${u.city || ''}, ${u.state || ''}`,
    'Profession': u.profession,
    'Genres': u.genres.join(', '),
    'Instruments': u.instruments.join(', '),
    'Skills': u.skills.join(', '),
    'Resources': u.resources.join(', '),
    'Active': u.isActive ? 'Yes' : 'No',
    'Tier': u.stripe.tier,
    'Plan': u.stripe.plan,
    'Referred By': u.referredBy,
  }));

  await toCSV(usersFormatted, 'users.csv');

};
