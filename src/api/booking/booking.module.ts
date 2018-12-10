import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BookableModule } from 'src/api/bookable/bookable.module';
import { BookingSagas } from 'src/api/booking/booking.sagas';
import { CommandHandlers } from 'src/api/booking/commands';
import { BookingEventsModel } from 'src/api/booking/events/booking-events.model';
import { BookingSchema } from 'src/api/booking/schemas/booking.schema';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
    BookableModule,
    SharedModule,
    UsersModule,
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingEventsModel,
    BookingSagas,
    ...CommandHandlers,
  ],
})
export class BookingModule implements OnModuleInit {

  constructor(
    private event$: EventBus,
    private command$: CommandBus,
    private moduleRef: ModuleRef,
    private bookingSagas: BookingSagas,
    private bookingEvents: BookingEventsModel,
  ) {
  }

  onModuleInit() {
    this.event$.setModuleRef(this.moduleRef);
    this.command$.setModuleRef(this.moduleRef);

    this.command$.register(CommandHandlers);

    this.event$.combineSagas(this.bookingSagas.sagas);
  }
}
