import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersBillingService } from 'src/users/services/users-billing.service';
import { IUser } from '../interfaces/user.interface';
import { UsersService } from '../services/users.service';
import { UserSelfVm } from '../vm/user-self.vm';
import { UsersController } from './users.controller';

describe('Users Controller', () => {
  let module: TestingModule;
  let ctrl: UsersController;
  let usersService: UsersService;

  beforeAll(async () => {

    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    })
      .overrideProvider(UsersBillingService).useValue({})
      .compile();
  });

  beforeEach(() => {
    ctrl = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(ctrl).toBeDefined();
  });

});
