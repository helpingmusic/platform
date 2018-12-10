import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IComment } from 'src/api/thread/comments/comment.interface';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class CommentService extends EntityService<IComment> {

  constructor(@InjectModel('Comment') model: Model<IComment>) {
    super(model);
  }

  async getParent(commentId: string) {
    const comment = await this.model.findById(commentId)
      .populate('parent');

    return comment.parent as IComment;
  }

  async populateThread(comment: IComment) {
    const populated = await comment.populate({ // get poster
      path: 'thread',
      populate: {
        path: 'media.item',
        populate: {
          path: 'poster',
          select: '_id first_name last_name',
        },
      },
    })
      .execPopulate();

    return populated.thread;
  }

  async remove(comment: IComment) {
    return this.update(comment, { removedAt: new Date() });
  }

}
