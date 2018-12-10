import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class UpdateIssueStatusDto {

  @ApiModelProperty({
    description: 'When the issue was closed',
    type: Date,
  })
  @IsDate()
  readonly closed_at: Date;
}