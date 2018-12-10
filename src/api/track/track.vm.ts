import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserProfileVm } from 'src/users/vm/user-profile.vm';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class TrackVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  @Type(() => UserProfileVm)
  user: UserProfileVm;

  @ApiModelProperty()
  @Expose()
  title: string;

  @ApiModelProperty()
  @Expose()
  href: string;

  @ApiModelProperty()
  @Expose()
  tags: Array<string>;

  @ApiModelProperty()
  @Expose()
  duration: number;

  @ApiModelProperty()
  @Expose()
  mediaType: string;

  @ApiModelProperty()
  @Expose()
  created_at: Date;

  @ApiModelProperty()
  @Expose()
  updated_at: Date;
}