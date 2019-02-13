import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersAuthService } from 'src/users/services/users-auth.service';
import { UsersService } from 'src/users/services/users.service';
import { UserSelfVm } from 'src/users/vm/user-self.vm';
import { CurrentUserController } from './current-user.controller';

describe('CurrentUser Controller', () => {
  let module: TestingModule;
  let ctrl: CurrentUserController;

  const userServiceMock = {
    getById: jest.fn(),
  };
  const userAuthMock = {};

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CurrentUserController],
    })
      .overrideProvider(UsersService).useValue(userServiceMock)
      .overrideProvider(UsersAuthService).useValue(userAuthMock)
      .compile();

    ctrl = module.get<CurrentUserController>(CurrentUserController);
  });

  it('should be defined', () => {
    expect(ctrl).toBeDefined();
  });

  describe('#me', () => {
    const id = '123';
    let res;

    beforeAll(async () => {
      jest.spyOn(userServiceMock, 'getById')
        .mockImplementationOnce(() => ({} as IUser));
      res = await ctrl.me({ _id: id } as IUser);
    });

    it('should call user service with current user id', async () => {
      expect(userServiceMock.getById).toHaveBeenCalledWith(id);
    });

  });
});
