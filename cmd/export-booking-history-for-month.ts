import { toCSV } from 'cmd/util';
import fs from 'fs';
import { INestApplicationContext } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import moment from 'moment';
import json2csv from 'json2csv';
import { Model } from 'mongoose';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';

export const ExportBookingHistoryForMonth = async (app: INestApplicationContext): Promise<any> => {
  const Booking = app.get<Model<IBooking>>(getModelToken('Booking'));

  const bookings = await Booking.find({
    status: 'confirmed',
    createdAt: {
      $gte: moment('2018-12-01').startOf('month').toDate(),
      $lte: moment('2018-12-31').endOf('year').toDate(),
    },
  })
    .sort('createdAt')
    .populate({
      path: 'booker',
      attributes: ['_id', 'first_name', 'last_name'],
    })
    .exec();

  const moneySpentByBooker = bookings.reduce((agg, b) => {
    const name = `${(b.booker as any).first_name} ${(b.booker as any).last_name}`;
    return {
      ...agg,
      [name]: (agg[name] || 0) + (b.invoiceAmount / 100),
    };
  }, {});

  const data = Object.keys(moneySpentByBooker)
    .map(u => ({ User: u, $: moneySpentByBooker[u] }));

  await toCSV(data, 'home-dec-booking-totals.csv');

};
