import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailTemplates } from 'src/core/email/email-templates.enum';
import { EmailService } from 'src/core/email/email.service';
import { ConfirmUserEmailCommand } from 'src/users/commands/impl/confirm-user-email.command';

@CommandHandler(ConfirmUserEmailCommand)
export class ConfirmUserEmailHandler implements ICommandHandler<ConfirmUserEmailCommand> {

  constructor(
    private mail: EmailService,
  ) {
  }

  async execute(cmd: ConfirmUserEmailCommand, resolve: (value?) => void) {
    const { user } = cmd;

    await this.mail.send({
      template: EmailTemplates.UPDATE_EMAIL,
      to: [{ email: user.email, name: user.name }],
      content: {
        name: user.first_name,
        userId: user._id,
      },
    });

    resolve();
  }

}