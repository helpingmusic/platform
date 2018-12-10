import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserProfileVm } from 'src/users/vm/user-profile.vm';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class ReviewVm extends DocumentVm{
  @ApiModelProperty()
  @Expose()
  content: string;

  @ApiModelProperty()
  @Expose()
  rating: number;

  @ApiModelProperty()
  @Expose()
  @Type(() => UserProfileVm)
  poster: UserProfileVm;

  @ApiModelProperty()
  @Expose()
  @Type(() => String)
  reviewee: string;

  @ApiModelProperty()
  @Expose()
  created_at: Date;

  @ApiModelProperty()
  @Expose()
  updated_at: Date;
}