import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadDataException } from 'src/common/exceptions/bad-data.exception';
import { QuickCreateUserDto } from 'src/users/dto/quick-create-user.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersBillingService } from 'src/users/services/users-billing.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private billingService: UsersBillingService,
  ) {
  }

  getById(id: string): Promise<IUser | null> {
    return this.userModel.findById(id).exec();
  }

  findOne(query: object): Promise<IUser | null> {
    return this.userModel.findOne(query).exec();
  }

  find(query?: object): Promise<Array<IUser>> {
    return this.userModel.find(query).exec();
  }

  findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({
      email: String(email).toLowerCase(),
    })
      .exec();
  }

  async createUser(createUserDto: Partial<IUser>): Promise<IUser> {
    const existing = await this.userModel.count({ email: createUserDto.email }).exec();
    if (existing !== 0) {
      throw new BadDataException({ field: 'email', message: 'Email already exists' });
    }

    return this.userModel.create(createUserDto);
  }

  async update(user: string | IUser, changes: any): Promise<IUser> {
    const u = (typeof user === 'string') ? await this.getById(user) : user;

    if (!u) {
      throw new NotFoundException('User not found');
    }

    u.set(changes);
    return u.save();
  }

  /**
   * For the quick signup page,
   *  sign up a user and get a commitment from them on signup
   * @param data
   */
  async quickCreate(data: QuickCreateUserDto) {
    const u = await this.createUser({
      email: data.email,
      referredBy: data.referredBy,
    });

    try {
      await this.billingService.setToken(u, data.token);
      await this.billingService.addAccountCredit(u, data.amountToCommit);
    } catch (e) {
      await u.remove();
      throw new BadDataException({
        field: 'token',
        message: e.message,
      });
    }
    return u;
  }

}
