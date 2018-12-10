import { Injectable } from '@nestjs/common';
import CalendarAPI from 'node-google-calendar';
import { CalendarEventDataDto } from 'src/api/booking/dto/calendar-event-data.dto';
import { ConfigService } from 'src/shared/config/config.service';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';

@Injectable()
export class CalendarService {

  private calendar: CalendarAPI;
  log: ILogger;

  constructor(
    private config: ConfigService,
    log: LogService,
  ) {
    this.log = log.createLogger('calendar');

    this.calendar = new CalendarAPI({
      key: config.get('GOOGLE_SA_PKEY'),
      serviceAcctId: config.get('GOOGLE_SA_EMAIL'),
      timezone: 'UTC-06:00',
    });
  }

  /**
   * Check whether time is available on calendar
   * @param calendars - Array of calendar ids to check against
   * @param startTime
   * @param endTime
   */
  async checkFreeBusy(calendars: Array<string>, startTime: Date, endTime: Date): Promise<boolean> {

    const events = await this.calendar.FreeBusy.query(calendars[0], {
      timeMin: startTime,
      timeMax: endTime,
      items: calendars.map(id => ({ id })),
    });

    return events.length === 0;
  }

  /**
   * Add event from data to each calendar
   * @param calendars
   * @param data
   */
  async addEvents(calendars: Array<string>, data: CalendarEventDataDto) {

    const events = await Promise.all(
      calendars.map(async (gcalId) => {
        try {
          const event = await this.calendar.Events.insert(gcalId, {
            start: { dateTime: data.start },
            end: { dateTime: data.end },
            summary: data.summary,
            status: data.status,
          });
          return { event: event.id, gcalId };
        } catch (e) {
          this.log.debug('Could not add event to calendar:', gcalId);
          this.log.error(e);
        }
        return null;
      }),
    );

    const allEventsBooked = events.every(e => !!e);
    // not all events were placed, so remove all and throw error
    if (!allEventsBooked) {
      await this.removeEvents(events);
      throw new Error('Could not place booking');
    }

    return events;
  }

  /**
   * Remove all events by id from each calendar they're on
   * @param events
   */
  async removeEvents(events: Array<{ gcalId: string; event: string; }>) {
    await Promise.all(
      events.map(({ event, gcalId }) => {
        if (!event || !gcalId) return Promise.resolve(false);
        return this.calendar.Events.delete(gcalId, event);
      }),
    );
  }

}
