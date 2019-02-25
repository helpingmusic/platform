import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';
import { UserOverviewVm } from 'src/users/vm/user-overview.vm';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class CommentVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  @Type(() => String)
  thread: string;

  @ApiModelProperty()
  @Expose()
  @Transform((v) => v ? String(v) : v)
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