import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { DocumentVm } from 'src/common/abstract/document.vm';

@Exclude()
export class UserOverviewVm extends DocumentVm {

  @ApiModelProperty()
  @Expose()
  readonly first_name: string;

  @ApiModelProperty()
  @Expose()
  readonly last_name: string;

  @ApiModelProperty()
  @Expose()
  readonly email: string;

  @ApiModelProperty()
  @Expose()
  readonly profile_pic: string;

  @ApiModelProperty()
  @Expose()
  readonly active_until: Date;

  @ApiModelProperty()
  @Expose()
  readonly created_at: Date;
}