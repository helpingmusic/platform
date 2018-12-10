import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class PasswordResetDto {

  @ApiModelProperty()
  @IsString()
  readonly token: string;

  @ApiModelProperty()
  @IsString()
  @MinLength(6)
  readonly newPassword: string;

}