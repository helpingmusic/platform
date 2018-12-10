import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateModelMock } from 'fixtures/mocks/model.mock';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const userModelMock = CreateModelMock('User');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: userModelMock },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
