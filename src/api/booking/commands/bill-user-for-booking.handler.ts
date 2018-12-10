import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BookableService } from 'src/api/bookable/bookable.service';
import { BookingService } from 'src/api/booking/booking.service';
import { BillUserForBookingCommand } from 'src/api/booking/commands/bill-user-for-booking.command';
import { UsersBillingService } from 'src/users/services/users-billing.service';
import { UsersService } from 'src/users/services/users.service';
import { CommandResult } from 'src/common/abstract/command-result';
import { moment } from 'src/common/vendor';

@CommandHandler(BillUserForBookingCommand)
export class BillUserForBookingHandler implements ICommandHandler<BillUserForBookingCommand> {

  constructor(
    private userService: UsersService,
    private userBilling: UsersBillingService,
    private bookingService: BookingService,
    private bookableService: BookableService,
  ) {
  }

  async execute(cmd: BillUserForBookingCommand, resolve: (value?) => void) {
    const { userId, booking } = cmd;

    const booker = await this.userService.getById(userId);
    const bookable = this.bookableService.findById(booking.bookable);

    // Grab Rate and bill user
    const rate = this.bookableService.getRateForPlan(booking.bookable, booker.stripe.plan);
    const start = moment(booking.time.start).format('MMM Do');

    let invoice;
    try {
      invoice = await this.userBilling.charge(booker, [{
          amount: rate * booking.duration,
          description: `${booking.duration} hour H.O.M.E. Session at ${bookable.location} on ${start}.`,
          metadata: { bookingId: String(booking._id) },
        }],
        { description: `${booking.duration} hour session at ${bookable.location}` },
      );
    } catch (e) {
      resolve(
        new CommandResult(false, e),
      );
      return;
    }

    await this.bookingService.update(booking, {
      invoiceId: invoice.id,
      invoiceItemId: invoice.lines.data[0].id,
      invoiceAmount: invoice.amount_due,
    });

    resolve(
      new CommandResult(true, booking),
    );
  }
}
