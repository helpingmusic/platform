import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from 'src/core/email/commands/send-email.command';
import { defaultEmailMessage } from 'src/core/email/email.constants';
import { SendEmailDto } from 'src/core/email/send-email.dto';
import { Mandrill } from 'mandrill-api/mandrill';
import { ConfigService } from 'src/shared/config/config.service';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {

  mailer: Mandrill;
  log: ILogger;

  templateData = {
    homeurl: 'https://my.evolvemusic.org',
    name: 'Homie',
  };

  constructor(
    private config: ConfigService,
    log: LogService,
  ) {
    this.log = log.createLogger('mail');
    this.mailer = new Mandrill(config.get('MANDRILL_KEY'));
    this.templateData.homeurl = config.get('DOMAIN');
  }

  async execute(cmd: SendEmailCommand, done: (value?) => void) {

    const { data }: { data: SendEmailDto } = cmd;

    const templateContent = Object.keys({ ...this.templateData, ...data.content})
      .map(name => ({ name, content: data.content[name] }));

    const mail = {
      template_name: data.template,
      merge: true,
      merge_language: 'handlebars',
      global_merge_vars: templateContent,
      template_content: templateContent,
      message: {
        ...defaultEmailMessage,
        to: data.to.map(to => ({ name: 'Homie', type: 'to', ...to })),
        global_merge_vars: templateContent,
        template_content: templateContent,
      },
    };

    await new Promise((resolve, reject) => {
      this.mailer.messages.sendTemplate(mail, resolve, reject);
    });

    this.log.verbose('mail sent', {
      template: data.template,
      to: mail.message.to,
    });

    done();
  }

}
