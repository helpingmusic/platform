import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefundUserBookingCommand } from 'src/api/booking/commands/refund-user-booking.command';
import { IBooking } from 'src/api/booking/interfaces/booking.interface';
import { moment, stripe } from 'src/common/vendor';

@CommandHandler(RefundUserBookingCommand)
export class RefundUserBookingHandler implements ICommandHandler<RefundUserBookingCommand> {

  GRACE_PERIOD = 1; // grace period hours
  HALF_REFUND_GRACE = 72; // hours

  constructor() {
  }

  /**
   * Calculate refund percentage based off booking
   * @param booking {IBooking}
   */
  getRefundPercentage(booking: IBooking) {
    let refundPercentage = 0;

    // give half refund if session farther out than HALF_REFUND_GRACE
    const hoursUntilSession = moment(booking.start).diff(moment(), 'hours');
    if (hoursUntilSession > this.HALF_REFUND_GRACE) {
      refundPercentage = 50;
    }

    // Grace period of an hour after booking
    if (moment().diff(moment(booking.createdAt), 'hours') <= this.GRACE_PERIOD) {
      refundPercentage = 100;
    }

    return refundPercentage;
  }

  async execute(cmd: RefundUserBookingCommand, resolve: (value?) => void) {
    const { booking } = cmd;

    const refundPercentage = this.getRefundPercentage(booking);
    const refundAmount = booking.invoiceAmount * (refundPercentage / 100);

    // if nothing to refund, do nothing
    if (refundAmount === 0) {
      return resolve();
    }

    const invoice = await stripe.invoices.retrieve(booking.invoiceId);
    const refund = await stripe.refunds.create({
      charge: invoice.charge as string,
      amount: refundAmount,
      metadata: { bookingId: String(booking._id) },
      reason: 'requested_by_customer',
    });

    await booking.update({ refundId: refund.id });

    resolve();
  }
}
