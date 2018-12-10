import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IThread } from 'src/api/thread/thread.interface';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class ThreadService extends EntityService<IThread> {

  constructor(@InjectModel('Thread') model: Model<IThread>) {
    super(model);
  }

  show(id: string) {
    return this.model.findById(id)
      .populate({
        path: '_comments',
        options: { sort: { createdAt: 1 } },
        populate: 'commenter',
      })
      .exec();
  }

  findByPost(postId: string) {
    return this.model.findOne({
      'media.item': postId,
    })
      .populate({
        path: '_comments',
        options: { sort: { createdAt: 1 } },
        populate: 'commenter',
      })
      .exec();
  }

}

