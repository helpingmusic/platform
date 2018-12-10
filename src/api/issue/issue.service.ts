import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityService } from 'src/common/abstract/entity.service';
import { IIssue } from './issue.interface';

@Injectable()
export class IssueService extends EntityService<IIssue> {

  constructor(@InjectModel('Issue') model: Model<IIssue>) {
    super(model);
  }

}
