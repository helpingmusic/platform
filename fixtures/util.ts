import { INestApplication } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { IUser } from 'src/users/interfaces/user.interface';

/**
 * Create a jwt for a given user
 * @param user
 * @param app
 */
export const authTokenFor = (user: IUser, app: INestApplication) => {
  const auth = app.get<AuthService>(AuthService);
  return auth.signToken(user);
};
