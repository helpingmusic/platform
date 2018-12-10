import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';
import { UserSelfVm } from 'src/users/vm/user-self.vm';

export class UserCreateResponseVm {

  @ApiModelProperty()
  @Expose()
  @Type(() => UserSelfVm)
  readonly user: UserSelfVm;

  @ApiModelProperty()
  @Expose()
  readonly token: string;

}
