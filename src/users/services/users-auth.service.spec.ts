import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateModelMock } from 'fixtures/mocks/model.mock';
import { UpdateUserPasswordDto } from 'src/users/dto/update-user-password.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/services/users.service';
import { UsersAuthService } from './users-auth.service';

describe('UsersAuthService', () => {
  let service: UsersAuthService;
  const userModelMock = CreateModelMock('User');

  const user = {} as IUser;
  const userServiceMock = {
    getById: jest.fn().mockResolvedValue(user),
    update: jest.fn().mockImplementation((u, c) => Promise.resolve({ ...u, ...c })),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersAuthService,
        { provide: getModelToken('User'), useValue: userModelMock },
      ],
    })
      .overrideProvider(UsersService).useValue(userServiceMock)
      .compile();
    service = module.get<UsersAuthService>(UsersAuthService);
  });

  beforeEach(() => {
    userServiceMock.update.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#updatePassword', () => {
    const userId = '1';
    const changes: UpdateUserPasswordDto = {
      oldPassword: 'old',
      newPassword: 'new',
    };

    it('should update user when authenticated', async () => {
      jest.spyOn(service, 'authenticate').mockResolvedValueOnce(true);
      const updated = await service.updatePassword(userId, changes);
      expect(userServiceMock.update).toHaveBeenCalledTimes(1);
    });

    it('should throw error when not authenticated', async () => {
      jest.spyOn(service, 'authenticate').mockResolvedValueOnce(false);
      await expect(service.updatePassword(userId, changes)).rejects.toThrow(UnauthorizedException);
      expect(userServiceMock.update).toHaveBeenCalledTimes(0);
    });

  });

});
