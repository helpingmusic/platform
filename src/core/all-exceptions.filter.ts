import { ArgumentsHost, Catch, HttpServer, Inject } from '@nestjs/common';
import { BaseExceptionFilter, HTTP_SERVER_REF } from '@nestjs/core';
import Raven from 'raven';
import { ConfigService } from 'src/shared/config/config.service';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

  constructor(
    private config: ConfigService,
    @Inject(HTTP_SERVER_REF) applicationRef: HttpServer,
  ) {
    super(applicationRef);

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

  catch(exception: any, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();

    // don't report non server errors
    if (exception.status && String(exception.status)[0] !== '5') {
      return super.catch(exception, host);
    }

    let user;
    if (req && req.user) {
      user = req.user._id;
    }

    if (this.config.get('NODE_ENV') === 'production') {
      Raven.captureException(exception, {
        tags: {
          args: host.getArgs(),
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

    super.catch(exception, host);
  }
}