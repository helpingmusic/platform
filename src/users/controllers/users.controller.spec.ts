import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
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
    }).compile();
  });

  beforeEach(() => {
    ctrl = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(ctrl).toBeDefined();
  });

  describe('#me', () => {
    const id = '123';
    let res;

    beforeAll(async () => {
      jest.spyOn(usersService, 'getById')
        .mockImplementationOnce(() => ({} as IUser));
      // res = await ctrl.me({ user: { _id: id } });
    });

    it('should call user service with current user id', async function() {
      expect(usersService.getById).toHaveBeenCalledWith(id);
    });

    it('should return a UserSelfVm instance', async function() {
      expect(res).toBeInstanceOf(UserSelfVm);
    });

  });

});
