import { UserSelfVm } from 'src/users/vm/user-self.vm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class LoginResponseDto {
  @ApiModelProperty()
  @Expose()
  token: string;

  @ApiModelProperty()
  @Expose()
  @Type(() => UserSelfVm)
  user: UserSelfVm;
}