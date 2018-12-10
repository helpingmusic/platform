import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IVideo } from 'src/api/video/video.interface';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class VideoService extends EntityService<IVideo> {

  constructor(@InjectModel('Video') model: Model<IVideo>) {
    super(model);
  }

}
