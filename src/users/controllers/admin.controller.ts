import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from 'src/users/services/users.service';
import { UserAdminOverviewVm } from 'src/users/vm/user-admin-overview.vm';
import { UserOverviewVm } from 'src/users/vm/user-overview.vm';
import { Output } from 'src/common/decorators/output.decorator';
import { UserSelfVm } from 'src/users/vm/user-self.vm';

/**
 * Endpoints for admin only
 */

@Controller('users')
@ApiUseTags('Users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRoles.ADMIN)
export class AdminController {

  constructor(
    private userService: UsersService,
  ) {
  }

  @Get()
  @ApiOperation({ title: 'Get all users' })
  @Output(UserAdminOverviewVm)
  get() {
    return this.userService.find();
  }

  @Get(':id')
  @ApiOperation({ title: 'Show User' })
  @Output(UserSelfVm)
  show(@Param('id') userId: string) {
    return this.userService.getById(userId);
  }

}
