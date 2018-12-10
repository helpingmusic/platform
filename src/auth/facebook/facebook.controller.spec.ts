import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { FacebookController } from './facebook.controller';

describe('Facebook Controller', () => {
  let module: TestingModule;

  const authMock = {};

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [FacebookController],
    })
      .overrideProvider(AuthService).useValue(authMock)
      .compile();
  });
  it('should be defined', () => {
    const controller: FacebookController = module.get<FacebookController>(FacebookController);
    expect(controller).toBeDefined();
  });
});
