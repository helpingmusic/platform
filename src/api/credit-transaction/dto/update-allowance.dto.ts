import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateAllowanceDto {
  @ApiModelPropertyOptional()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiModelPropertyOptional()
  @IsString()
  runOn: string;

}