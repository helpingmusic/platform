import { Module } from '@nestjs/common';
import { BookableController } from 'src/api/bookable/bookable.controller';
import { BookableService } from 'src/api/bookable/bookable.service';
import { CalendarService } from 'src/api/bookable/calendar.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [BookableController],
  providers: [BookableService, CalendarService],
  exports: [BookableService, CalendarService],
})
export class BookableModule {
}
