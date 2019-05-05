import { NestFactory } from '@nestjs/core';
import { ExportBookingHistoryForMonth } from 'cmd/export-booking-history-for-month';
import { UpdateStripeCustomersMetadata } from 'cmd/update-stripe-customers-metadata';
import { AppModule } from 'src/app.module';

module.exports = async function command(cmd: string) {

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  switch (cmd) {
    case 'export-booking-history':
      await ExportBookingHistoryForMonth(app);
      break;

    case 'update-stripe-customers-metadata':
      await UpdateStripeCustomersMetadata(app);
      break;
  }
};
