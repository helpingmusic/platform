import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateCreditTransactionDto {
  @ApiModelProperty()
  @IsString()
  user: string;

  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  // for meta
  @ApiModelPropertyOptional()
  @IsString()
  notes: string;
}