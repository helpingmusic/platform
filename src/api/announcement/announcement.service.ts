import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityService } from 'src/common/abstract/entity.service';
import { IAnnouncement } from './announcement.interface';

@Injectable()
export class AnnouncementService extends EntityService<IAnnouncement> {

  constructor(
    @InjectModel('Announcement') model: Model<IAnnouncement>,
  ) {
    super(model);
  }

}
