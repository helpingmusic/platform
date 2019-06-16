import { NestFactory } from '@nestjs/core';
import { ExportBookingHistoryForMonth } from 'cmd/export-booking-history-for-month';
import { AddNewStripePlans } from 'cmd/stripe-migrations/2019-06-16-add-new-plans';
import { UpdateStripeCustomersMetadata } from 'cmd/update-stripe-customers-metadata';
import { ExportUsers } from 'cmd/export-users';
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

    case 'export-users':
      await ExportUsers(app);
      break;

    case 'migrate-stripe':
      await AddNewStripePlans(app);
      break;
  }
};
