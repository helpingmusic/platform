import { ICommand } from '@nestjs/cqrs';
import { SendEmailDto } from 'src/core/email/send-email.dto';

export class SendEmailCommand implements ICommand {
  constructor(public data: SendEmailDto) {
  }
}
