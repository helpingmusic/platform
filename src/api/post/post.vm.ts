import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ThreadVm } from 'src/api/thread/thread.vm';
import { UserProfileVm } from 'src/users/vm/user-profile.vm';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class PostVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  content: string;

  @ApiModelProperty()
  @Expose()
  @Type(() => UserProfileVm)
  poster: UserProfileVm;

  @ApiModelProperty()
  @Expose()
  @Type(() => ThreadVm)
  thread: ThreadVm;

  @ApiModelProperty()
  @Expose()
  created_at: Date;

  @ApiModelProperty()
  @Expose()
  updated_at: Date;
}