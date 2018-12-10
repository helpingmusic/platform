import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersAuthService } from 'src/users/services/users-auth.service';
import { UsersService } from 'src/users/services/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly userAuthService: UsersAuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const valid = await this.userAuthService.authenticate(user, password);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return user;
  }

}