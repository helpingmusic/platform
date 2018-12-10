import { ApiModelProperty } from '@nestjs/swagger';
import { IsDateString, Min, Max, IsNumber, IsString } from 'class-validator';
import { MAX_BOOKING_DURATION, MIN_BOOKING_DURATION } from 'src/api/bookable/constants';

export class CreateBookingDto {
  booker: string;

  @ApiModelProperty()
  @IsString()
  bookable: string;

  @ApiModelProperty()
  @IsDateString()
  start: Date;

  @ApiModelProperty()
  @IsNumber()
  @Min(MIN_BOOKING_DURATION)
  @Max(MAX_BOOKING_DURATION)
  duration: number;
}