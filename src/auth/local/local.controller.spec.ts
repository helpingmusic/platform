import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { IUser } from '../../users/interfaces/user.interface';
import { UsersAuthService } from '../../users/services/users-auth.service';
import { UsersService } from '../../users/services/users.service';

import { AuthService } from '../auth.service';
import { LocalController } from './local.controller';
import { LocalStrategy } from './local.strategy';

describe('Local Controller', () => {
  let app: INestApplication;
  let module: TestingModule;
  let ctrl: LocalController;

  const loginData = {
    email: 'test@example.com',
    password: 'test',
  };
  const userService = {
    findByEmail: async e => e === loginData.email ? (loginData as IUser) : null,
  };
  const userAuthService = {
    authenticate: async (u, p) => p === loginData.password,
  };
  const authService = {
    signToken: jest.fn(() => {
    }),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [LocalController],
      providers: [LocalStrategy],
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .overrideProvider(UsersAuthService)
      .useValue(userAuthService)
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    ctrl = module.get<LocalController>(LocalController);
  });

  it('should be defined', () => {
    expect(ctrl).toBeDefined();
  });

  describe('POST /auth/local', () => {

    describe('when using correct credentials', () => {
      let res;

      beforeAll(async () => {
        res = await request(app.getHttpServer())
          .post('/auth/local')
          .send(loginData);
      });

      it('should be okay', function() {
        expect(res.status).toBe(200);
      });

      it('should sign token', async () => {
        const u = await userService.findByEmail(loginData.email);
        expect(authService.signToken).toBeCalledWith(u);
      });

    });

    it('should be unauthorized with bad email', function() {
      return request(app.getHttpServer())
        .post('/auth/local')
        .send({ email: 'badEmail', password: 'test' })
        .expect(401);
    });

    it('should be unauthorized with bad password', function() {
      return request(app.getHttpServer())
        .post('/auth/local')
        .send({ email: 'test@example.com', password: 'badpassword' })
        .expect(401);
    });

  });

});
