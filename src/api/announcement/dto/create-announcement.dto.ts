import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAnnouncementDto {

  @ApiModelProperty({
    description: 'Title of Announcement',
    type: String,
  })
  @IsString()
  readonly title: string;

  @ApiModelProperty({
    description: 'Announcement Text',
    type: String,
  })
  @IsString()
  readonly body: string;
}