import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendEmailDto } from 'src/core/email/send-email.dto';
import { SendEmailCommand } from 'src/core/email/commands/send-email.command';

@Injectable()
export class EmailService {

  constructor(
    private cmdBus: CommandBus,
  ) {
  }

  async send(data: SendEmailDto): Promise<any> {
    return this.cmdBus.execute(
      new SendEmailCommand(data),
    );
  }

}
