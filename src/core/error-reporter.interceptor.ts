import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import Raven from 'raven';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from 'src/shared/config/config.service';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';

@Injectable()
export class ErrorReporterInterceptor implements NestInterceptor {

  log: ILogger;

  constructor(
    private config: ConfigService,
    log: LogService,
  ) {
    this.log = log.createLogger('error');

    Raven.config('https://3cce8e0cf9ba416b90042e0b1ba028ee@sentry.io/306765', {
      environment: config.get('NODE_ENV'),
      parseUser(req) {
        if (!req.user) return {};
        return {
          email: req.user.email,
          name: req.user.name,
          id: req.user._id,
        };
      },
    })
      .install();
  }

  intercept(ctx: ExecutionContext, call$: Observable<any>): Observable<any> {

    return call$.pipe(
      tap(
        () => {
        },
        (err) => this.captureError(err, ctx),
      ),
    );
  }

  captureError(err: any, context: ExecutionContext) {

    if (err.status && err.status < 500) { // user error, don't report
      return;
    }

    this.log.error(err);
    this.log.error(err.stack);

    const req = context.switchToHttp().getRequest();

    let user;
    if (req && req.user) {
      user = req.user._id;
    }

    Raven.captureException(err, {
      tags: {
        args: context.getArgs(),
      },
      extra: {
        method: req.method,
        path: req.path,
        params: req.params,
        body: req.body,
        query: req.query,
        user,
      },
    });
  }
}