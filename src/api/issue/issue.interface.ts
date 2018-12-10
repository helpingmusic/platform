import { Document } from 'mongoose';
import { IssueTypes } from 'src/api/issue/issue-types.enum';

export interface IIssue extends Document {
  description: string;
  type: IssueTypes;

  closed_at: Date;

  submittedBy: string;

  opened_at: Date;
  updated_at: Date;
}