import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class PasswordResetDto {

  @ApiModelProperty({ description: 'New Password' })
  @IsString()
  @MinLength(6)
  readonly password: string;

}