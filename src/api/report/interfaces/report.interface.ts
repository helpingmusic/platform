import { Document } from 'mongoose';
import { ReportStatus } from 'src/api/report/report-status.enum';

export interface IReport extends Document {
  status: ReportStatus;

  media: {
    kind: string,
    item: string,
  };

  reporter: string;
  reason: string;
  statusReason: string;
  description: string;

  resolved_at: Date;

  opened_at: Date;
  updated_at: Date;
}