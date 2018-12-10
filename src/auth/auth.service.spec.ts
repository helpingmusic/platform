import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersAuthService } from 'src/users/services/users-auth.service';
import { UsersService } from 'src/users/services/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const userServiceMock = {};
  const userAuthServiceMock = {};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secretOrPrivateKey: 'secret' }),
      ],
      providers: [AuthService],
    })
      .overrideProvider(UsersService).useValue(userServiceMock)
      .overrideProvider(UsersAuthService).useValue(userAuthServiceMock)
      .compile();
    service = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
