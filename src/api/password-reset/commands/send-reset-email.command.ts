import { ICommand } from '@nestjs/cqrs';
import { IPasswordReset } from 'src/api/password-reset/password-reset.interface';

export class SendResetEmailCommand implements ICommand {
  constructor(
    public passwordReset: IPasswordReset,
    public token: string,
  ) {
  }
}
