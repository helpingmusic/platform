import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { UserSelfVm } from 'src/users/vm/user-self.vm';

/**
 * User detail meant for admin
 */

@Exclude()
export class UserAdminDetailVm extends UserSelfVm {
  @ApiModelProperty()
  @Expose()
  phoneNumber: string;
}