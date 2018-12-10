import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class DiscountVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  title: string;

  @ApiModelProperty()
  @Expose()
  body: string;

  @ApiModelProperty()
  @Expose()
  created_at: Date;

  @ApiModelProperty()
  @Expose()
  updated_at: Date;
}