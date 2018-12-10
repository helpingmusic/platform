import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailTemplates } from 'src/core/email/email-templates.enum';
import { EmailService } from 'src/core/email/email.service';
import { UsersService } from 'src/users/services/users.service';
import { SendFailedPaymentEmailCommand } from 'src/webhooks/stripe/commands/send-failed-payment-email.command';

@CommandHandler(SendFailedPaymentEmailCommand)
export class SendFailedPaymentEmailHandler implements ICommandHandler<SendFailedPaymentEmailCommand> {

  constructor(
    private userService: UsersService,
    private emailService: EmailService,
  ) {
  }

  async execute(cmd: SendFailedPaymentEmailCommand, resolve: (value?) => void) {
    const { invoice } = cmd;

    const user = await this.userService.findOne({ 'stripe.customerId': invoice.customer });

    const activeUntil = new Date(user.active_until).toDateString();

    resolve();

    return this.emailService.send({
      template: EmailTemplates.FAILED_PAYMENT,
      to: [{
        email: user.email,
        name: user.first_name,
      }],
      content: {
        name: user.first_name,
        activeUntil,
      },
    });
  }

}