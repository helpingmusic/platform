import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CalendarService } from 'src/api/bookable/calendar.service';
import { RemoveBookingFromCalendarCommand } from 'src/api/booking/commands/remove-booking-from-calendar.command';

@CommandHandler(RemoveBookingFromCalendarCommand)
export class RemoveBookingFromCalendarHandler implements ICommandHandler<RemoveBookingFromCalendarCommand> {

  constructor(
    private calendar: CalendarService,
  ) {
  }

  async execute(cmd: RemoveBookingFromCalendarCommand, resolve: (value?) => void) {
    const { eventIds } = cmd;
    await this.calendar.removeEvents(eventIds);
    resolve();
  }
}
