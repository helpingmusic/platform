import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReport } from 'src/api/report/interfaces/report.interface';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class ReportService extends EntityService<IReport> {

  constructor(@InjectModel('Report') model: Model<IReport>) {
    super(model);
  }

  index() {
    return this.model.find({})
      .populate({
        path: 'media.item',
        populate: {
          path: 'poster',
          model: 'User',
          select: '_id first_name last_name profile_pic',
        },
      })
      .populate({
        path: 'media.item',
        populate: {
          path: 'commenter',
          model: 'User',
          select: '_id first_name last_name profile_pic',
        },
      })
      .sort('-opened_at')
      .exec();
  }

}
