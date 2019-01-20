import yargs from 'yargs';
import { NestFactory } from '@nestjs/core';
import { ExportBookingHistoryForMonth } from 'cmd/export-booking-history-for-month';
import { AppModule } from 'src/app.module';

process.on('unhandledRejection', r => console.log(r));

module.exports = async function command(cmd: string) {

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  console.log(`Processing cmd "${cmd}" \n\n`);

  switch (cmd) {
    case 'export-booking-history':
      await ExportBookingHistoryForMonth(app);
      break;

    default:
      console.log(`Could not find cmd "${cmd}"`);
  }
};
