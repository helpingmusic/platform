import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReview } from 'src/api/review/review.interface';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class ReviewService extends EntityService<IReview> {

  constructor(@InjectModel('Review') model: Model<IReview>) {
    super(model);
  }

  find(where: any = {}): Promise<Array<IReview>> {
    return this.model.find(where)
      .sort('-created_at')
      .populate('poster')
      .exec();
  }

}
