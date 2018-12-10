import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDiscountDto {

  @ApiModelProperty({
    description: 'Title of Discount',
    type: String,
  })
  @IsString()
  readonly title: string;

  @ApiModelProperty({
    description: 'Description of Discount',
    type: String,
  })
  @IsString()
  readonly body: string;

}