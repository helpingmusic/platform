import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookableService } from 'src/api/bookable/bookable.service';
import { BookingStatus } from 'src/api/booking/booking-status.enum';
import { BillUserForBookingCommand } from 'src/api/booking/commands/bill-user-for-booking.command';
import { CreateBookingDto } from 'src/api/booking/dto/create-booking.dto';
import { UpdateBookingDto } from 'src/api/booking/dto/update-booking.dto';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';
import { BadDataException } from 'src/exceptions/bad-data.exception';
import { UsersService } from 'src/users/services/users.service';
import { CommandResult } from 'src/common/abstract/command-result';
import { moment } from 'src/common/vendor';

@Injectable()
export class BookingService {

  constructor(
    private cmdBus: CommandBus,
    private eventBus: EventBus,
    private bookableService: BookableService,
    private userService: UsersService,
    @InjectModel('Booking') private readonly bookingModel: Model<IBooking>,
  ) {
  }

  findById(id: string) {
    return this.bookingModel.findById(id).exec();
  }

  /**
   * Get booking for a user
   * @param booker - user's id
   */
  getForUser(booker: string): Promise<Array<IBooking>> {
    return this.bookingModel.find({ booker }).exec();
  }

  /**
   * Create Valid Booking
   * @param b {CreateBookingDto} booking data to create
   */
  async create(b: CreateBookingDto): Promise<IBooking> {

    // verify bookable
    const bookables = await this.bookableService.index();
    const bookable = bookables.find(bo => bo._id === b.bookable);
    if (!bookable) {
      throw new BadDataException({
        field: 'bookable',
        message: 'This bookable does not exist.',
        input: b.bookable,
      });
    }

    const end = moment(b.start).add(b.duration, 'hours').seconds(0).milliseconds(0).toDate();

    // Check if time slot is available for user's tier
    const booker = await this.userService.getById(b.booker);
    if (!this.bookableService.userCanBookTime(bookable._id, booker.stripe.plan, b.start, end)) {
      throw new BadDataException({
        field: 'startTime',
        message: `Time slot not available for ${booker.stripe.tier} members.`,
        input: b.start,
      });
    }

    // validate time slot is open on calendar
    if (!await this.bookableService.timeSlotIsOpen(bookable._id, b.start, end)) {
      throw new BadDataException({
        field: 'startTime',
        message: 'Time Slot Not Available.',
        input: b.start,
      });
    }

    const booking = await this.bookingModel.create({
      ...b,
      end: moment(b.start).add(b.duration, 'hours').toDate(),
    });

    const res: CommandResult = await this.cmdBus.execute(
      new BillUserForBookingCommand(b.booker, booking),
    );

    // If payment fails, destroy the booking
    if (!res.successful) {
      await this.remove(booking._id);
      throw new BadDataException({
        field: 'payment',
        message: res.error,
      });
    }

    return booking;
  }

  async update(booking: string | IBooking, changes: UpdateBookingDto): Promise<IBooking> {
    const b: IBooking = (typeof booking === 'string') ? await this.findById(booking) : booking;
    b.set(changes);
    return b.save();
  }

  /**
   * Cancel a booking
   * @param bookingId
   */
  async cancel(bookingId: string) {
    const b = await this.bookingModel.findById(bookingId);

    if (!b) {
      throw new NotFoundException('Booking not found');
    }

    return this.update(b, { status: BookingStatus.CANCELLED });
  }

  /**
   * Remove booking
   * @param bookingId
   */
  async remove(bookingId: string) {
    return this.bookingModel.remove(bookingId);
  }

}
