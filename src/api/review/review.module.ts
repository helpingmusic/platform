import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { NotificationsModule } from 'src/api/notifications/notifications.module';
import { CommandHandlers } from 'src/api/review/commands';
import { ReviewEventsModel } from 'src/api/review/events/review-events.model';
import { ReviewSagas } from 'src/api/review/review.sagas';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { ReviewController } from './review.controller';

import { ReviewSchema } from './review.schema';
import { ReviewService } from './review.service';

@Module({
  imports: [
    CQRSModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
    SharedModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    ReviewEventsModel,
    ...CommandHandlers,
    ReviewSagas,
  ],
})
export class ReviewModule implements OnModuleInit {

  constructor(
    private reviewEventModel: ReviewEventsModel,
    private moduleRef: ModuleRef,
    private cmd$: CommandBus,
    private event$: EventBus,
    private reviewSagas: ReviewSagas,
  ) {
  }

  onModuleInit() {
    this.cmd$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.cmd$.register(CommandHandlers);

    this.event$.combineSagas(this.reviewSagas.sagas);
  }
}
