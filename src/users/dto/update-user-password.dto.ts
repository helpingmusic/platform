import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {

  @ApiModelProperty()
  @IsString()
  readonly oldPassword: string;

  @ApiModelProperty()
  @IsString()
  @MinLength(6)
  readonly newPassword: string;

}