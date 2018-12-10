import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateVideoDto {

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

}