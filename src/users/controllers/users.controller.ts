import { Body, Controller, forwardRef, Get, Inject, OnModuleInit, Param, Post, UseGuards } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { ITokenAssignable } from 'src/auth/interfaces/token-assignable.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { QuickCreateUserDto } from 'src/users/dto/quick-create-user.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/services/users.service';
import { UserCreateResponseVm } from 'src/users/vm/user-create-response.vm';
import { UserProfileVm } from 'src/users/vm/user-profile.vm';
import { UserSelfVm } from 'src/users/vm/user-self.vm';
import { Output } from 'src/common/output.decorator';

@Controller('users')
@ApiUseTags('Users')
export class UsersController implements OnModuleInit {

  auth: AuthService;

  constructor(
    private usersService: UsersService,
    private moduleRef: ModuleRef,
  ) {
  }

  onModuleInit(): any {
    // todo less hacky way to get auth service
    this.auth = this.moduleRef.get<AuthService>(AuthService, { strict: false });
  }

  @Post()
  @ApiOperation({ title: 'Creates a new User' })
  @Output(UserCreateResponseVm)
  async create(@Body() body: CreateUserDto): Promise<ITokenAssignable> {
    const user = await this.usersService.createUser(body);
    const token = this.auth.signToken(user);
    return { user: user.toObject(), token };
  }

  @Get(':id')
  @ApiOperation({ title: 'Show User' })
  @UseGuards(AuthGuard('jwt'))
  @Output(UserProfileVm)
  show(@Param('id') id: string): Promise<IUser> {
    return this.usersService.getById(id);
  }

  @Post('quick-signup')
  @ApiOperation({ title: 'Creates a new User' })
  @Output(UserSelfVm)
  quickSignup(@Body() body: QuickCreateUserDto) {
    return this.usersService.quickCreate(body);
  }

}
