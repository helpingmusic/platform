import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserPhotoDto {

  @ApiModelProperty()
  @IsString()
  readonly photoType: string;

}