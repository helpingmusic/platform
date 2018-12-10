import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Strategy } from 'passport-facebook';
import { AuthProviders } from 'src/auth/auth-providers.enum';
import { IFacebookProfile } from 'src/auth/facebook/facebook-profile.interface';
import { ConfigService } from 'src/shared/config/config.service';
import { StorageService } from 'src/core/storage/storage.service';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersAuthService } from 'src/users/services/users-auth.service';
import { UsersService } from 'src/users/services/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'facebook') {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly userAuthService: UsersAuthService,
    private readonly config: ConfigService,
    private readonly storage: StorageService,
  ) {
    super({
      clientID: config.get('FACEBOOK_ID'),
      clientSecret: config.get('FACEBOOK_SECRET'),
      callbackURL: `${config.get('DOMAIN')}/auth/facebook/callback`,
      scope: ['email', 'user_about_me'],
      failureRedirect: '/signup',
      session: false,
      profileFields: [
        'id',
        'displayName',
        'emails',
        'profileUrl',
        'picture.type(large)',
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: IFacebookProfile, done) {
    const emails = profile.emails.map(e => e.value);
    let user = await this.userAuthService.findByOauthProvider(AuthProviders.FACEBOOK, profile.id, emails);

    // user has not already signed up
    if (!user) {
      user = await this.createNewUser(profile, accessToken);
    }

    await user.update({
      facebook: profile._json,
      personal_links: { facebook: profile.profileUrl },
    });

    return done(null, user);
  }

  /**
   * Create new user from facebook profile
   */
  private async createNewUser(profile: IFacebookProfile, accessToken: string): Promise<IUser> {
    const emails = profile.emails.map(e => e.value);
    const name = profile.displayName.split(' ');

    const user = await this.userService.createUser({
      first_name: name.shift(),
      last_name: name.join(' '),
      email: emails[0],
      provider: AuthProviders.FACEBOOK,
    });

    // Get profile photo
    if (profile.photos[0].value) {
      const profileUrl = await this.storage.storeFileByURL(profile.photos[0].value, ['users', user._id, 'profile_pic']);
      user.set({ profile_pic: profileUrl });
    }

    // Get banner photo
    const res = await axios.get(`https://graph.facebook.com/${profile.id}`, {
      params: { fields: 'cover', access_token: accessToken },
    });
    if (res.data.cover) {
      const bannerUrl = await this.storage.storeFileByURL(res.data.cover.source, ['users', user._id, 'banner']);
      user.set({ banner: bannerUrl });
    }

    return user.save();
  }

}