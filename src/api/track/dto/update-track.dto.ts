import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateTrackDto {

  @ApiModelProperty({
    description: 'Title of Track',
    type: String,
  })
  @IsString()
  readonly title: string;

  @ApiModelProperty({
    description: 'Tags',
    type: String,
    isArray: true,
  })
  @IsArray()
  tags: Array<string>;
}