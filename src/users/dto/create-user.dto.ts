import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

  @ApiModelProperty()
  @IsString()
  readonly first_name: string;

  @ApiModelProperty()
  @IsString()
  readonly last_name: string;

  @ApiModelProperty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly password: string;

}