import { ClassSerializerInterceptor, HttpStatus, INestApplication, UseInterceptors } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { Exclude, Expose } from 'class-transformer';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { OutputInterceptor } from 'src/common/interceptors/output.interceptor';
import { Output } from './output.decorator';
import { agent as request, Response } from 'supertest';

class TestObject {
  propA: string;
  propB: string;
  propC: string;

  constructor(body: Partial<TestObject>) {
    Object.assign(this, body);
  }
}

class TestVm {
  @Expose()
  propA: string;

  @Exclude()
  propC: string;
}

class AdminTestVm {
  @Expose()
  propA: string;

  @Exclude()
  propB: string;
}

@UseInterceptors(ClassSerializerInterceptor)
class TestController {

  @Output(TestVm)
  test() {
    return new TestObject({ propA: 'a', propB: 'b', propC: 'c' });
  }

  @Output(TestVm)
  tests() {
    return [
      new TestObject({ propA: 'a', propB: 'b' }),
      new TestObject({ propA: 'c', propB: 'd' }),
    ];
  }

  @Output({
    [UserRoles.USER]: TestVm,
    [UserRoles.ADMIN]: AdminTestVm,
  })
  async rolesTest(): Promise<TestObject> {
    return new TestObject({ propA: 'a', propB: 'b' });
  }
}

describe('Output Decorator', () => {
  let moduleFixture: TestingModule;
  let ctrl: TestController;
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: OutputInterceptor,
        },
      ],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

  });

  it('should be defined', () => {
    expect(ctrl).toBeDefined();
  });

  it('should return an instance of the view model', async function() {
    return request(server).get('/announcements')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should return an array of the view model when given an array', async function() {
    const res = await ctrl.tests();
    expect(res).toHaveLength(2);
    expect(res[0]).toBeInstanceOf(TestVm);
    expect(res[0]).not.toHaveProperty('propB');
  });

  it('should work with promises', async function() {
    const res = await ctrl.waitTest();
    expect(res).toBeInstanceOf(TestVm);
    expect(res).not.toHaveProperty('propB');
    expect(res.propA).toBe('a');
  });

});
