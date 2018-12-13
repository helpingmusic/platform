import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/auth/guards/roles.enum';

export class OutputData {
  [role: string]: new(...args) => any;
}

@Injectable()
export class OutputInterceptor implements NestInterceptor {

  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {

    const output = this.reflector.get<OutputData>('output', context.getHandler());

    if (!output) return call$;

    const user = context.switchToHttp().getRequest().user;
    const role = user && user.role;
    const ViewModel = output[role] || output[UserRoles.GUEST];

    return call$.pipe(
      map(data => {
        const flat = [].concat(data)
          .map(d => d.toObject ? d.toObject() : d);

        const result = Array.isArray(data) ? flat : flat[0];

        return plainToClass(ViewModel, result, { strategy: 'excludeAll' });
      }),
    );
  }
}