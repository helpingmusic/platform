import { EmailTemplates } from 'src/core/email/email-templates.enum';

class EmailRecieverDto {
  email: string;
  name: string;
}

export class SendEmailDto {
  template: EmailTemplates;
  to: Array<EmailRecieverDto>;
  content: object;
}
