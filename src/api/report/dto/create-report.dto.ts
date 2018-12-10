import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateReportDto {

  @ApiModelProperty({
    description: 'Type of media being reported',
    type: String,
  })
  @IsString()
  mediaType: string;

  @ApiModelProperty({
    description: 'ID of media reported',
    type: String,
  })
  @IsString()
  mediaId: string;

  @ApiModelProperty({
    description: 'Report Reason',
    type: String,
  })
  @IsString()
  readonly reason: string;

  @ApiModelPropertyOptional({
    description: 'Description of report',
    type: String,
  })
  @IsString()
  @IsOptional()
  readonly description: string;
}