import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateTrackDto {

  @ApiModelProperty({
    description: 'Title of Track',
    type: String,
  })
  @IsString()
  readonly title: string;

  @ApiModelProperty({
    description: 'Duration of Track',
    type: String,
  })
  @IsNumberString()
  duration: number;

  @ApiModelProperty({
    description: 'Tags joined by comma',
    type: String,
  })
  @IsString()
  tags: string;
}