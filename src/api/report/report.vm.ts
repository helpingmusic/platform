import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ReportStatus } from 'src/api/report/report-status.enum';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class ReportVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  media: {
    kind: string,
    item: any,
  };

  @ApiModelProperty()
  @Expose()
  status: ReportStatus;

  @ApiModelProperty()
  @Expose()
  @Type(() => String)
  reporter: string;

  @ApiModelProperty()
  @Expose()
  reason: string;

  @ApiModelProperty()
  @Expose()
  statusReason: string;

  @ApiModelProperty()
  @Expose()
  description: string;

  @ApiModelProperty()
  @Expose()
  opened_at: Date;

  @ApiModelProperty()
  @Expose()
  resolved_at: Date;

  @ApiModelProperty()
  @Expose()
  updated_at: Date;
}