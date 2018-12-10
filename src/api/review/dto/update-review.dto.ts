import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {

  @ApiModelProperty({
    description: 'Review Content',
    type: String,
  })
  @IsString()
  readonly content: string;

  @ApiModelProperty({
    description: 'Review rating out of 5',
    type: Number,
  })
  @Min(0)
  @Max(5)
  @IsNumber()
  readonly rating: number;

}