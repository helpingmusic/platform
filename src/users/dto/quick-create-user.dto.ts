import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class QuickCreateUserDto {

  @ApiModelProperty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  readonly referredBy: string;

  @ApiModelProperty({ description: 'Stripe Token' })
  @IsString()
  readonly token: string;

  @ApiModelProperty({ description: 'Amount to commit to membership' })
  @IsNumber()
  readonly amountToCommit: number;

}