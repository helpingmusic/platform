import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CommandHandlers } from 'src/api/post/commands';
import { PostEventsModel } from 'src/api/post/events/post-events.model';
import { PostSagas } from 'src/api/post/post.sagas';
import { ThreadModule } from 'src/api/thread/thread.module';
import { SharedModule } from 'src/shared/shared.module';
import { PostController } from './post.controller';

import { PostSchema } from './post.schema';
import { PostService } from './post.service';

@Module({
  imports: [
    CQRSModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    SharedModule,
    ThreadModule,
  ],
  controllers: [PostController],
  providers: [
    PostEventsModel,
    PostService,
    ...CommandHandlers,
    PostSagas,
  ],
})
export class PostModule implements OnModuleInit {

  constructor(
    private postEventModel: PostEventsModel,
    private moduleRef: ModuleRef,
    private cmd$: CommandBus,
    private event$: EventBus,
    private postSagas: PostSagas,
  ) {
  }

  onModuleInit() {
    this.cmd$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.cmd$.register(CommandHandlers);

    this.event$.combineSagas(this.postSagas.sagas);
  }
}
