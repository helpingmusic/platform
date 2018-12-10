import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBillingDto {

  @ApiModelProperty({ description: 'Stripe Token ID' })
  @IsString()
  readonly token: string;

}