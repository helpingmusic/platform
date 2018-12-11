import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Model } from 'mongoose';
import { SendResetEmailCommand } from 'src/api/password-reset/commands/send-reset-email.command';
import { IPasswordReset } from 'src/api/password-reset/password-reset.interface';
import { BadDataException } from 'src/common/exceptions/bad-data.exception';
import { UsersService } from 'src/users/services/users.service';
import { moment } from 'src/common/vendor';

@Injectable()
export class PasswordResetService {

  constructor(
    private userService: UsersService,
    private cmd$: CommandBus,
    @InjectModel('PasswordReset') private readonly model: Model<IPasswordReset>,
  ) {
  }

  /**
   * Generate 16 character random string
   */
  private genToken(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Check
   * @param pr
   * @param token
   */
  private checkToken(pr: IPasswordReset, token: string): Promise<boolean> {
    return bcrypt.compare(token, pr.token);
  }

  /**
   * Create Password reset
   * @param email - Email of user to create reset for
   */
  async createReset(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundException('Email Not Found');

    const token = this.genToken();
    const pr = await this.model.create({ user, token });

    await this.cmd$.execute(
      new SendResetEmailCommand(pr, token),
    );

  }

  /**
   * Check a token and reset the password
   * @param resetId
   * @param token
   * @param newPassword
   */
  async resetPassword(resetId: string, token: string, newPassword: string) {
    const pr = await this.model.findById(resetId);

    if (!pr) {
      throw new NotFoundException('Password reset token was not found.');
    }

    if (moment().isAfter(pr.expiresAt)) {
      throw new BadRequestException('Token has expired');
    }

    if (pr.usedAt) {
      throw new BadRequestException('Token has been used.');
    }

    const match = await this.checkToken(pr, token)
      .catch(() => {
        throw new BadRequestException('Token not valid');
      });

    if (!match) {
      throw new BadDataException({
        field: 'token',
        message: 'Token does not match',
      });
    }

    await this.userService.update(pr.user, { password: newPassword });
    await pr.update({ usedAt: new Date() });

  }

}
