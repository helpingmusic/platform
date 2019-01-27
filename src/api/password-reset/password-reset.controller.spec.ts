import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetService } from 'src/api/password-reset/password-reset.service';
import { PasswordResetController } from './password-reset.controller';

describe('PasswordReset Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PasswordResetController],
    })
      .overrideProvider(PasswordResetService).useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: PasswordResetController = module.get<PasswordResetController>(PasswordResetController);
    expect(controller).toBeDefined();
  });
});
