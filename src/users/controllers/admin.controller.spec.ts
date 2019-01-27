import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/services/users.service';
import { AdminController } from './admin.controller';

describe('Admin Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AdminController],
    })
      .overrideProvider(UsersService).useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: AdminController = module.get<AdminController>(AdminController);
    expect(controller).toBeDefined();
  });
});
