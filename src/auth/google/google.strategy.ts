import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthProviders } from 'src/auth/auth-providers.enum';
import { IGoogleProfile } from 'src/auth/google/google-profile.interface';
import { ConfigService } from 'src/shared/config/config.service';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersAuthService } from 'src/users/services/users-auth.service';
import { UsersService } from 'src/users/services/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly userAuthService: UsersAuthService,
    private readonly config: ConfigService,
  ) {
    super({
      clientID: config.get('GOOGLE_ID'),
      clientSecret: config.get('GOOGLE_SECRET'),
      callbackURL: `${config.get('DOMAIN')}/auth/google/callback`,
      failureRedirect: '/signup',
      scope: ['profile', 'email'],
      session: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: IGoogleProfile, done) {
    const emails = profile.emails.map(e => e.value);
    let user = await this.userAuthService.findByOauthProvider(AuthProviders.GOOGLE, profile.id, emails);

    // user has not already signed up
    if (!user) {
      user = await this.createNewUser(profile);
    } else {
      await user.update({ google: profile._json });
    }

    return done(null, user);
  }

  /**
   * Create new user from facebook profile
   */
  private async createNewUser(profile: IGoogleProfile): Promise<IUser> {
    return this.userService.createUser({
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
      email: profile.emails[0].value,
      provider: AuthProviders.GOOGLE,
      google: profile._json,
    });
  }

}