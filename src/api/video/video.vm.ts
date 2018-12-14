import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { VideoTypes } from 'src/api/video/video-types.enum';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class VideoVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  title: string;

  @ApiModelProperty()
  @Expose()
  body: string;

  @ApiModelProperty()
  @Expose()
  type: VideoTypes;

  @ApiModelProperty()
  @Expose()
  href: string;

  @ApiModelProperty()
  @Expose()
  mediumId: string;

  @ApiModelProperty()
  @Expose()
  createdAt: Date;

  @ApiModelProperty()
  @Expose()
  updatedAt: Date;
}