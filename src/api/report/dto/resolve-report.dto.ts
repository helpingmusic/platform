import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ReportStatus } from 'src/api/report/report-status.enum';

export class ResolveReportDto {

  @ApiModelProperty({
    description: 'New status for report',
    type: ReportStatus,
  })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiModelProperty({
    description: 'Admin note for resolved status',
    type: String,
  })
  @IsString()
  statusReason: string;

}