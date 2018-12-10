import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CommandHandlers } from 'src/api/discount/commands';
import { DiscountSagas } from 'src/api/discount/discount.sagas';
import { DiscountEventsModel } from 'src/api/discount/events/discount-events.model';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { DiscountController } from './discount.controller';

import { DiscountSchema } from './discount.schema';
import { DiscountService } from './discount.service';

@Module({
  imports: [
    CQRSModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Discount', schema: DiscountSchema }]),
    SharedModule,
    UsersModule,
  ],
  controllers: [DiscountController],
  providers: [
    DiscountService,
    DiscountEventsModel,
    ...CommandHandlers,
    DiscountSagas,
  ],
})
export class DiscountModule implements OnModuleInit {

  constructor(
    private discountEventModel: DiscountEventsModel,
    private moduleRef: ModuleRef,
    private cmd$: CommandBus,
    private event$: EventBus,
    private discountSagas: DiscountSagas,
  ) {
  }

  onModuleInit() {
    this.cmd$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.cmd$.register(CommandHandlers);

    this.event$.combineSagas(this.discountSagas.sagas);
  }
}
