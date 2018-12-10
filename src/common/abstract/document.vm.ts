import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class DocumentVm {
  @ApiModelProperty()
  @Expose()
  @Type(() => String)
  _id: string;
}
