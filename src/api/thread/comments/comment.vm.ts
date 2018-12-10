import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserOverviewVm } from 'src/users/vm/user-overview.vm';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class CommentVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  @Type(() => String)
  thread: string;

  @ApiModelProperty()
  @Expose()
  @Type(() => String)
  parent: string;

  @ApiModelProperty()
  @Expose()
  body: string;

  @ApiModelProperty()
  @Expose()
  @Type(() => UserOverviewVm)
  commenter: UserOverviewVm;

  @ApiModelProperty()
  @Expose()
  @Type(() => CommentVm)
  children: CommentVm[];

  @ApiModelProperty()
  @Expose()
  createdAt: Date;

  @ApiModelProperty()
  @Expose()
  updatedAt: Date;

  @ApiModelProperty()
  @Expose()
  removedAt: Date;
}