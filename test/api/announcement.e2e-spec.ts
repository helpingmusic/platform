import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IUserFactoryBuildOptions } from 'fixtures/factory/factories/user.factory';
import { FactoryModule } from 'fixtures/factory/factory.module';
import { FactoryService } from 'fixtures/factory/factory.service';
import { IAnnouncement } from 'src/api/announcement/announcement.interface';
import { AppModule } from 'src/app.module';
import { IUser } from 'src/users/interfaces/user.interface';
import { agent as request, Response } from 'supertest';
import { authTokenFor } from 'fixtures/util';

describe('AnnouncementController (e2e)', () => {
  let app: INestApplication;
  let server;
  let factory: FactoryService;
  let announcements: IAnnouncement[];
  let user, admin, expiredUser;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    factory = app.get<FactoryService>(FactoryService);

    announcements = await factory.createMany<IAnnouncement>('Announcement', 5);

    user = await factory.create<IUser>('User');
    admin = await factory.create<IUser>('User', {}, { admin: true } as IUserFactoryBuildOptions);
    expiredUser = await factory.create<IUser>('User', {}, { expired: true } as IUserFactoryBuildOptions);
  });

  afterAll(async () => {
    await factory.cleanUp();
  });

  describe('GET /announcements', () => {

    describe('should return Unauthorized', () => {
      it('When Unauthenticated', () => {
        return request(server).get('/announcements')
          .expect(HttpStatus.UNAUTHORIZED);
     });
      it('When account is inactive', () => {
        return request(server).get('/announcements')
          .auth(authTokenFor(expiredUser, app), { type: 'bearer' })
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('When Authenticated', () => {
      let response: Response;

      beforeAll(async () => {
        response = await request(server)
          .get('/announcements')
          .auth(authTokenFor(user, app), { type: 'bearer' });
      });

      it('should return okay', () => expect(response.status).toBe(HttpStatus.OK));

      it('should return array of announcements', () => {
        const responseIds = response.body.map(a => String(a._id));
        const expectedIds = announcements.map(a => String(a._id));
        expect(responseIds).toEqual(expect.arrayContaining(expectedIds));
      });
    });

  });
});
