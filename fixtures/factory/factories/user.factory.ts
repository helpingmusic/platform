import { AuthProviders } from 'src/auth/auth-providers.enum';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { MembershipPlans, MembershipTiers, MembershipType } from 'src/common/constants';
import { moment } from 'src/common/vendor';

export interface IUserFactoryBuildOptions {
  admin: boolean;
  expired: boolean;
}

export function registerUserFactory(User, factory) {

  const defaultUser = {
    first_name: factory.chance('first'),
    last_name: factory.chance('last'),
    email: factory.sequence('User.email', (n) => `test-user${n}@example.com`),
    password: 'test',
    provider: AuthProviders.LOCAL,
    role: UserRoles.USER,
    city: 'Nashville',
    state: 'TN',
    profession: factory.chance('profession'),
    bio: factory.chance('paragraph'),
    membership_types: factory.chance('pickset', [
      MembershipType.PLAYER,
      MembershipType.PRODUCER,
      MembershipType.PATRON,
      MembershipType.PERFORMER,
      MembershipType.PUBLISHER,
    ]),
    genres: factory.chance('pickset', [ 'rock', 'jazz', 'blues', 'pop', 'indie' ], 3),
    instruments: factory.chance('pickset', ['drums', 'guitar', 'piano', 'flute'], 2),
    skills: factory.chance('pickset', ['mixing', 'producing', 'illustrator'], 2),
    resources: factory.chance('pickset', ['PA', 'Home Studio', 'Mics'], 2),
    profile_pic: factory.chance('avatar'),
    stripe: {
      customerId: 'cust',
      subscriptionId: 'sub',
      plan: MembershipPlans.PRODUCTION_1,
      tier: MembershipTiers.PRODUCTION,
      status: 'active',
      periodEnd: moment().add(30, 'days').toDate(),
    },
    active_until: moment().add(30, 'days').toDate(),
    emailConfirmed: true,
  };

  factory.define('User', User, (options: IUserFactoryBuildOptions) => {
    const u = { ...defaultUser };

    if (options.admin) {
      u.role = UserRoles.ADMIN;
    }

    if (options.expired) {
      const d = moment().subtract(1, 'day').toDate();
      u.active_until = d;
      u.stripe.periodEnd = d;
      u.stripe.status = 'cancelled';
    }

    return u;
  });

}
