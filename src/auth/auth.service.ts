import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersAuthService } from 'src/users/services/users-auth.service';
import { UsersService } from 'src/users/services/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly usersAuthService: UsersAuthService,
    private readonly jwtService: JwtService,
  ) {
  }

  signToken(user: IUser): string {
    const token: JwtPayload = user.token;
    return this.jwtService.sign(token);
  }

  async validateUser(payload: JwtPayload): Promise<IUser> {
    return await this.usersService.getById(payload._id);
  }

}
