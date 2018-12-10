import morgan from 'morgan';
import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  log: ILogger;

  constructor(
    log: LogService,
  ) {
    this.log = log.createLogger('Req');
    morgan.token('user', req => req.user ? `user=${req.user._id}` : '');
  }

  resolve(...args: any[]): MiddlewareFunction {
    return morgan(':status :method :url :response-time ms :user', {
      stream: this.log.stream,
    });
  }
}
