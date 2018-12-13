import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OutputInterceptor } from 'src/common/interceptors/output.interceptor';
import { LoggerMiddleware } from 'src/common/logger.middleware';
import { ErrorReporterInterceptor } from 'src/core/error-reporter.interceptor';
import { UsersModule } from 'src/users/users.module';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { SearchModule } from './core/search/search.module';
import { SharedModule } from './shared/shared.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    SharedModule,
    CoreModule,
    UsersModule,
    AuthModule,
    ApiModule,
    WebhooksModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: OutputInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorReporterInterceptor,
    },
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }

}
