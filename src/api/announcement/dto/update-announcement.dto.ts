import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAnnouncementDto {

  @ApiModelProperty({
    description: 'Title of IAnnouncement',
    type: String,
  })
  @IsString()
  readonly title: string;

  @ApiModelProperty({
    description: 'IAnnouncement Text',
    type: String,
  })
  @IsString()
  readonly body: string;
}