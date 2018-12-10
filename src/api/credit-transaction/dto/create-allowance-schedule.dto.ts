import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateAllowanceScheduleDto {
  @ApiModelProperty()
  @IsString()
  user: string;

  @ApiModelProperty()
  @IsNumber()
  @Min(1)
  count: number;

  @ApiModelProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiModelProperty()
  @IsString()
  startOn: Date;

  @ApiModelProperty({ description: 'Frequency in Months' })
  @IsNumber()
  @Min(1)
  frequency: number;

}