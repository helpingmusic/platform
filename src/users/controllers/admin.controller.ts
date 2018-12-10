import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from 'src/users/services/users.service';
import { UserOverviewVm } from 'src/users/vm/user-overview.vm';
import { Output } from 'src/common/output.decorator';

/**
 * Endpoints for admin only
 */

@Controller('admin/users')
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
  @Output([UserOverviewVm])
  get() {
    return this.userService.find();
  }

}
