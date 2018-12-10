import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateModelMock } from 'fixtures/mocks/model.mock';
import { SendResetEmailCommand } from 'src/api/password-reset/commands/send-reset-email.command';
import { IPasswordReset } from 'src/api/password-reset/password-reset.interface';
import { BadDataException } from 'src/exceptions/bad-data.exception';
import { UsersService } from 'src/users/services/users.service';
import { moment } from 'src/common/vendor';
import { PasswordResetService } from './password-reset.service';

describe('PasswordResetService', () => {
  let service: PasswordResetService;

  const user = {};

  const modelMock = CreateModelMock('PasswordReset');
  const cmdBusMock = { execute: jest.fn() };
  const userServiceMock = {
    findByEmail: jest.fn().mockResolvedValue(user),
    update: jest.fn().mockImplementation((u, v) => ({ ...u, ...v })),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordResetService],
    })
      .overrideProvider(getModelToken('PasswordReset')).useValue(modelMock)
      .overrideProvider(UsersService).useValue(userServiceMock)
      .overrideProvider(CommandBus).useValue(cmdBusMock)
      .compile();

    service = module.get<PasswordResetService>(PasswordResetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#createReset', () => {
    const email = 'test@example.com';
    const token = 'test-token';
    const passwordReset = {} as IPasswordReset;

    beforeEach(() => {
      jest.spyOn<any, any>(service, 'genToken').mockReturnValueOnce(token);
      modelMock.create.mockResolvedValue(passwordReset);
      cmdBusMock.execute.mockClear();
    });

    it('should execute send password reset email command with token', async function() {
      await service.createReset(email);
      expect(cmdBusMock.execute).toHaveBeenCalledWith(new SendResetEmailCommand(passwordReset, token));
    });

    it('should throw exception is no user is found', async function() {
      userServiceMock.findByEmail.mockResolvedValueOnce(null);
      await expect(service.createReset(email)).rejects.toThrow(NotFoundException);
      expect(cmdBusMock.execute).toHaveBeenCalledTimes(0);
    });
  });

  describe('#resetPassword', () => {
    const resetId = '1';
    const token = 'test-token';
    const newPassword = 'secret';
    const pr = {
      user: '1',
      expiresAt: moment().add(1, 'day').toDate(),
      update: jest.fn(),
    };

    beforeAll(function() {
      modelMock.findById.mockResolvedValue(pr);
    });

    describe('when token is valid', () => {
      beforeAll(async () => {
        jest.spyOn<any, any>(service, 'checkToken').mockResolvedValue(true);
        await service.resetPassword(resetId, token, newPassword);
      });

      afterAll(function() {
        userServiceMock.update.mockClear();
      });

      it('should update user with new password', async () => {
        expect(userServiceMock.update).toHaveBeenCalledWith(pr.user, { password: newPassword });
      });
      it('should mark password reset as used', async () => {
        expect(pr.update).toHaveBeenCalledTimes(1);
      });
    });

    it('should reject if password reset is not found', async () => {
      modelMock.findById.mockResolvedValueOnce(null);
      await expect(service.resetPassword(resetId, token, newPassword))
        .rejects.toThrow(NotFoundException);
    });
    it('should reject if password reset is expired', async () => {
      modelMock.findById.mockResolvedValueOnce({ ...pr, expiresAt: moment().subtract(1, 'day') });
      await expect(service.resetPassword(resetId, token, newPassword))
        .rejects.toThrow(BadRequestException);
    });
    it('should reject if password reset is used', async () => {
      modelMock.findById.mockResolvedValueOnce({ ...pr, usedAt: moment().subtract(1, 'day') });
      await expect(service.resetPassword(resetId, token, newPassword))
        .rejects.toThrow(BadRequestException);
    });

    it('should reject if token does not match', async () => {
      jest.spyOn<any, any>(service, 'checkToken').mockResolvedValueOnce(false);
      await expect(service.resetPassword(resetId, token, newPassword))
        .rejects.toThrow(BadDataException);
    });

  });

});
