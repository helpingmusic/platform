import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CommentVm } from 'src/api/thread/comments/comment.vm';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class ThreadVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  @Type(() => CommentVm)
  comments: CommentVm[];

  @ApiModelProperty()
  @Expose()
  createdAt: Date;

  @ApiModelProperty()
  @Expose()
  updatedAt: Date;
}