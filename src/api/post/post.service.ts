import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost } from 'src/api/post/post.interface';
import { ThreadService } from 'src/api/thread/thread.service';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class PostService extends EntityService<IPost> {

  PAGE_SIZE = 15;

  constructor(
    @InjectModel('Post') model: Model<IPost>,
    private threadService: ThreadService,
  ) {
    super(model);
  }

  async paginate(query: any = {}, page = 0) {
    const posts = await this.model.find(query)
      .where('hidden').equals(false)
      .limit(this.PAGE_SIZE)
      .skip(this.PAGE_SIZE * page)
      .sort('-created_at')
      .populate('poster')
      .populate({
        path: 'thread',
        populate: {
          path: '_comments',
          populate: { path: 'commenter' },
        },
      })
      .exec();

    return posts;
  }

  async create(body: Partial<IPost>): Promise<IPost> {
    const p = await super.create(body);

    await p.populate('poster')
      .populate('thread')
      .execPopulate();

    return p;
  }

  async findById(id: string) {
    const post = await this.model.findById(id)
      .populate('poster')
      .exec();

    post.thread = await this.threadService.findByPost(id);

    return post;
  }

}
