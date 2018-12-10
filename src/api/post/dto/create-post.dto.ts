import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {

  @ApiModelProperty({
    description: 'Content of Post',
    type: String,
  })
  @IsString()
  readonly content: string;

}