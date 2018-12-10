import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Model } from 'mongoose';
import { AuthProviders } from 'src/auth/auth-providers.enum';
import { UpdateUserPasswordDto } from 'src/users/dto/update-user-password.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class UsersAuthService {

  constructor(
    private usersService: UsersService,
    @InjectModel('User') private readonly userModel: Model<IUser>,
  ) {
  }

  /**
   * Authenticate - check if the passwords are the same
   * Rehash the user password if match,
   *
   * @param {IUser} user
   * @param {String} password
   */
  async authenticate(user: IUser, password: string): Promise<boolean> {

    if (!user.password) {
      return false;
    }

    let match = false;
    let hasBcryptPassword = true;

    try {
      const rounds = bcrypt.getRounds(user.password);
      hasBcryptPassword = Number.isInteger(rounds);
    } catch (e) {
      hasBcryptPassword = false;
    }

    if (hasBcryptPassword) {
      match = await bcrypt.compare(password, user.password);
    } else {
      // get rounds threw error, so the password is not bcrypt based
      match = await new Promise((resolve, reject) => {
        crypto.pbkdf2(password, new Buffer(user.salt, 'base64'), 10000, 64, 'sha1', (err, key) => {
          if (err) reject(err);
          resolve(key.toString('base64') === user.password);
        });
      }) as boolean;
    }

    if (match) {
      await this.usersService.update(user, {
        password,
        salt: null,
      });
    }

    return match;
  }

  async findByOauthProvider(provider: AuthProviders, profileId: string, emails: Array<string>) {
    return this.userModel.findOne()
      .or([
        { [`${provider}.id`]: profileId },
        // Or search for all emails from facebook
        ...emails.map(email => ({ email })),
      ])
      .exec();
  }

  /**
   * Update a users password
   * @param userId
   * @param changes
   */
  async updatePassword(userId: string, changes: UpdateUserPasswordDto) {
    const u = await this.usersService.getById(userId);
    const authenticated = await this.authenticate(u, changes.oldPassword);

    if (!authenticated) {
      throw new UnauthorizedException({
        field: 'oldPassword',
        message: 'Current password does not match',
      });
    }
    return this.usersService.update(userId, { password: changes.oldPassword });
  }

}
