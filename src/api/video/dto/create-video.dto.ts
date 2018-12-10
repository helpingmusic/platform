import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { VideoTypes } from 'src/api/video/video-types.enum';

export class CreateVideoDto {

  @ApiModelProperty({
    description: 'Title of Video',
    type: String,
  })
  @IsString()
  readonly title: string;

  @ApiModelProperty({
    description: 'Description of Video',
    type: String,
  })
  @IsString()
  readonly body: string;

  @ApiModelProperty({
    description: 'Type of Video',
    type: VideoTypes,
  })
  @IsString()
  readonly type: VideoTypes;

  @ApiModelProperty({
    description: 'URL of Video',
    type: String,
  })
  @IsString()
  readonly url: string;

}