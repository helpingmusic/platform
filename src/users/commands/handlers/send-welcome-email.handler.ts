import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailTemplates } from 'src/core/email/email-templates.enum';
import { EmailService } from 'src/core/email/email.service';
import { SendWelcomeEmailCommand } from 'src/users/commands/impl/send-welcome-email.command';

@CommandHandler(SendWelcomeEmailCommand)
export class SendWelcomeEmailHandler implements ICommandHandler<SendWelcomeEmailCommand> {

  constructor(
    private mail: EmailService,
  ) {
  }

  async execute(cmd: SendWelcomeEmailCommand, resolve: (value?) => void) {
    const { user } = cmd;

    await this.mail.send({
      template: EmailTemplates.CONFIRM_ACCOUNT,
      to: [{ email: user.email, name: user.name }],
      content: {
        name: user.first_name,
        userId: user._id,
      },
    });

    resolve();
  }

}