import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendResetEmailCommand } from 'src/api/password-reset/commands/send-reset-email.command';
import { EmailTemplates } from 'src/core/email/email-templates.enum';
import { EmailService } from 'src/core/email/email.service';
import { UsersService } from 'src/users/services/users.service';

@CommandHandler(SendResetEmailCommand)
export class SendResetEmailHandler implements ICommandHandler<SendResetEmailCommand> {

  constructor(
    private email: EmailService,
    private userService: UsersService,
  ) {
  }

  async execute(cmd: SendResetEmailCommand, resolve: (value?) => void) {

    const { passwordReset, token } = cmd;
    const u = await this.userService.getById(passwordReset.user);

    await this.email.send({
      template: EmailTemplates.FORGOT_PASSWORD,
      to: [{ email: u.email, name: u.name }],
      content: {
        reset: passwordReset._id,
        token,
        name: u.first_name,
      },
    });

    resolve();
  }
}
