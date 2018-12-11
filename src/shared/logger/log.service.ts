import { Injectable } from '@nestjs/common';
import { ILogger } from 'src/shared/logger/logger.interface';
import util from 'util';
import { createLogger, format as fmt, Logger, transports } from 'winston';

@Injectable()
export class LogService implements ILogger {

  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'verbose',
      format: fmt.combine(
        fmt.timestamp(),
        fmt.metadata(),
        fmt.simple(),
        fmt.colorize({ level: true }),
        fmt.printf(info => {

          let message = info.message;
          if (typeof info.message === 'object') {
            message = util.inspect(info.message, {
              showHidden: false,
              depth: 4,
              colors: true,
            });
          }

          return `${info.metadata.timestamp} [${(info.metadata.label || '').toUpperCase()}]  ${info.level}: \t${message}`;
        }),
      ),
      transports: [
        new transports.Console(),
      ],
    });
  }

  // curry boi
  buildLogger(level: string) {
    return (namespace: string) =>
      (message: string, ...args: Array<any>) =>
        this.logger.log({
          level,
          message: typeof message === 'string' ? message.trim() : message,
          metadata: args,
          label: namespace,
        });
  }

  createLogger(ns: string): ILogger {
    return {
      info: this.buildLogger('info')(ns),
      error: this.buildLogger('error')(ns),
      verbose: this.buildLogger('verbose')(ns),
      debug: this.buildLogger('debug')(ns),
      stream: {
        write: this.buildLogger('info')(ns),
      },
    };
  }

  log(level: string, ...args: Array<any>) {
    const data = args.map(a => {
      if (typeof a === 'string') return a.trim();
      return a;
    });
    this.buildLogger(level)('')(data.shift(), data);
  }

  info(...args: Array<any>) {
    this.log('info', ...args);
  }

  verbose(...args: Array<any>) {
    this.log('verbose', ...args);
  }

  error(...args: Array<any>) {
    this.log('error', ...args);
  }

  debug(...args: Array<any>) {
    this.log('debug', ...args);
  }

  stream = {
    write: (message: string) => {
      this.info(message.trim());
    },
  };

}
