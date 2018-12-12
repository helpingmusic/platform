import { Module, MulterModule, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import multerS3 from 'multer-s3';
import { CreditTransactionModule } from 'src/api/credit-transaction/credit-transaction.module';
import { NotificationsModule } from 'src/api/notifications/notifications.module';
import { StorageModule } from 'src/core/storage/storage.module';
import { StorageService } from 'src/core/storage/storage.service';
import { SearchModule } from 'src/core/search/search.module';
import { SharedModule } from 'src/shared/shared.module';
import { CommandHandlers } from 'src/users/commands';
import { EventHandlers } from 'src/users/events';
import { UserEventsModel } from 'src/users/events/user-events.model';
import { UserNotificationsService } from 'src/users/services/user-notifications.service';
import { UserSagas } from 'src/users/user.sagas';
import { FileUpload } from 'src/core/storage/file-upload.type';
import { AdminController } from './controllers/admin.controller';
import { CurrentUserController } from './controllers/current-user.controller';
import { NotificationController } from './controllers/notification.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { UsersController } from './controllers/users.controller';
import { UserSchema } from './schemas/user.schema';
import { UsersAuthService } from './services/users-auth.service';
import { UsersBillingService } from './services/users-billing.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    SharedModule,
    CreditTransactionModule,
    NotificationsModule,
    SearchModule,

    MulterModule.registerAsync({
      imports: [StorageModule],
      inject: [StorageService],
      useFactory: (store: StorageService) => ({
        limits: { files: 1 },
        storage: multerS3({
          s3: store.s3,
          bucket: store.bucket,
          acl: 'public-read',
          contentType: multerS3.AUTO_CONTENT_TYPE,
          metadata(req, file: FileUpload, cb: (err: any, data: any) => void) {
            cb(null, {
              fieldName: file.fieldname,
              filename: file.originalname,
            });
          },
          key(req, file: FileUpload, cb: (err: any, path: string) => void) {
            const ext = (file.encoding).split('/').pop();
            const hash = Math.random().toString(36).substr(2, 5);
            const fn = `${file.fieldname}.${hash}.${ext}`;
            cb(null, ['users', req.user._id, 'photos', fn].join('/'));
          },
        }),
      }),
    }),
  ],
  controllers: [
    // UserResourcesController,
    CurrentUserController,
    UsersController,
    AdminController,
    SubscriptionController,
    NotificationController,
  ],
  providers: [
    UsersService,
    UsersBillingService,
    UsersAuthService,
    UserNotificationsService,
    UserEventsModel,
    ...EventHandlers,
    ...CommandHandlers,
    UserSagas,
  ],
  exports: [
    UsersService,
    UsersBillingService,
    UsersAuthService,
    UserNotificationsService,
  ],
})
export class UsersModule implements OnModuleInit {

  constructor(
    private userEvents: UserEventsModel,
    private moduleRef: ModuleRef,
    private cmd$: CommandBus,
    private event$: EventBus,
    private userSagas: UserSagas,
  ) {
  }

  onModuleInit() {
    this.event$.setModuleRef(this.moduleRef);
    this.cmd$.setModuleRef(this.moduleRef);

    this.event$.register(EventHandlers);
    this.cmd$.register(CommandHandlers);

    this.event$.combineSagas(this.userSagas.sagas);
  }

}
