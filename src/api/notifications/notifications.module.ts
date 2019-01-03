import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandHandlers } from 'src/api/notifications/commands';
import { NotificationEventsModel } from 'src/api/notifications/events/notification-events.model';
import { NotificationSagas } from 'src/api/notifications/notification.sagas';
import { NotificationSchema } from 'src/api/notifications/schemas/notification.schema';
import { EmailModule } from 'src/core/email/email.module';
import { SharedModule } from 'src/shared/shared.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    CQRSModule,
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
    EmailModule,
    SharedModule,
  ],
  providers: [
    NotificationsService,
    ...CommandHandlers,
    NotificationSagas,
    NotificationEventsModel,
  ],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule implements OnModuleInit {
  constructor(
    private notificationEvents: NotificationEventsModel,
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private sagas: NotificationSagas,
  ) {
  }

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.command$.register(CommandHandlers);

    this.event$.combineSagas(this.sagas.sagas);
  }

}
