import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class AnnouncementVm extends DocumentVm {

  @ApiModelProperty()
  @Expose()
  title: string;

  @ApiModelProperty()
  @Expose()
  body: string;

  @ApiModelProperty()
  @Expose()
  created_at: Date;

}