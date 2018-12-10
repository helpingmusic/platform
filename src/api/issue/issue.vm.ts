import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class IssueVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  description: string;

  @ApiModelProperty()
  @Expose()
  type: string;

  @ApiModelProperty()
  @Expose()
  closed_at: Date;

  @ApiModelProperty()
  @Expose()
  opened_at: Date;

  @ApiModelProperty()
  @Expose()
  isOpen: boolean;
}