import { Test, TestingModule } from '@nestjs/testing';
import { UsersAuthService } from 'src/users/services/users-auth.service';
import { UsersService } from 'src/users/services/users.service';
import { CurrentUserController } from './current-user.controller';

describe('CurrentUser Controller', () => {
  let module: TestingModule;

  const userServiceMock = {};
  const userAuthMock = {};

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CurrentUserController],
    })
      .overrideProvider(UsersService).useValue(userServiceMock)
      .overrideProvider(UsersAuthService).useValue(userAuthMock)
      .compile();
  });
  it('should be defined', () => {
    const controller: CurrentUserController = module.get<CurrentUserController>(CurrentUserController);
    expect(controller).toBeDefined();
  });
});
