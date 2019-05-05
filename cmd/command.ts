import { NestFactory } from '@nestjs/core';
import { ExportBookingHistoryForMonth } from 'cmd/export-booking-history-for-month';
import { ExportUsers } from 'cmd/export-users';
import { AppModule } from 'src/app.module';

module.exports = async function command(cmd: string) {

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  switch (cmd) {
    case 'export-booking-history':
      await ExportBookingHistoryForMonth(app);
      break;
    case 'export-users':
      await ExportUsers(app);
      break;
  }
};
