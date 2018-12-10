import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { NotificationsModule } from 'src/api/notifications/notifications.module';
import { CommandHandlers } from 'src/api/thread/comments/commands';
import { CommentController } from 'src/api/thread/comments/comment.controller';
import { CommentSagas } from 'src/api/thread/comments/comment.sagas';
import { CommentSchema } from 'src/api/thread/comments/comment.schema';
import { CommentService } from 'src/api/thread/comments/comment.service';
import { CommentEventsModel } from 'src/api/thread/comments/events/comment-events.model';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    SharedModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentEventsModel,
    CommentSagas,
    ...CommandHandlers,
  ],
})
export class CommentsModule implements OnModuleInit {

  constructor(
    private commentEvents: CommentEventsModel,
    private moduleRef: ModuleRef,
    private cmd$: CommandBus,
    private event$: EventBus,
    private sagas: CommentSagas,
  ) {
  }

  onModuleInit() {
    this.cmd$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.cmd$.register(CommandHandlers);

    this.event$.combineSagas(this.sagas.sagas);
  }
}
