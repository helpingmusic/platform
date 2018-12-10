import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailTemplates } from 'src/core/email/email-templates.enum';
import { EmailService } from 'src/core/email/email.service';
import { UsersService } from 'src/users/services/users.service';
import { SendUserInvoiceCommand } from 'src/webhooks/stripe/commands/send-user-invoice.command';

@CommandHandler(SendUserInvoiceCommand)
export class SendUserInvoiceHandler implements ICommandHandler<SendUserInvoiceCommand> {

  constructor(
    private userService: UsersService,
    private emailService: EmailService,
  ) {
  }

  async execute(cmd: SendUserInvoiceCommand, resolve: (value?) => void) {
    const { invoice } = cmd;

    const user = await this.userService.findOne({ 'stripe.customerId': invoice.customer });

    let discount;
    if (invoice.discount) {
      const coup = invoice.discount.coupon;
      discount = { code: coup.id };
      let amountOff;
      if (coup.percent_off) {
        amountOff = (coup.percent_off / 100) * invoice.subtotal;
      } else {
        amountOff = coup.amount_off;
      }
      discount.amount = (amountOff / 100).toFixed(2);
    }

    const accountCredit = invoice.starting_balance < 0 ? -invoice.starting_balance : 0;
    const accountBalance = invoice.starting_balance >= 0 ? invoice.starting_balance : 0;

    const amountDue = invoice.total + invoice.starting_balance;

    resolve();

    return this.emailService.send({
      template: EmailTemplates.INVOICE,
      to: [{
        email: user.email,
        name: user.first_name,
      }],
      content: {
        name: user.first_name,
        billItems: invoice.lines.data.map((line, i) => ({
          number: i + 1,
          name: line.description,
          amount: (line.amount / 100).toFixed(2),
        })),
        subtotal: (invoice.subtotal / 100).toFixed(2),
        discount,
        total: (invoice.total / 100).toFixed(2),
        accountCredit: accountCredit && (accountCredit / 100).toFixed(2),
        accountBalance: accountBalance && (accountBalance / 100).toFixed(2),
        amountDue: (amountDue / 100).toFixed(2),
      },
    });

  }

}