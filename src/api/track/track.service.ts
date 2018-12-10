import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITrack } from 'src/api/track/track.interface';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class TrackService extends EntityService<ITrack> {

  constructor(@InjectModel('Track') model: Model<ITrack>) {
    super(model);
  }

  indexForUser(user: string) {
    return this.model.find({
      user,
      $or: [
        { deletedAt: { $exists: false } },
        { deletedAt: null },
      ],
    })
      .sort('-created_at')
      .populate('user')
      .exec();
  }

  delete(id: string) {
    return this.update(id, { deletedAt: new Date() });
  }

}
