import { ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  constructor(private errorMessage: string) {
  }

  intercept(context: ExecutionContext, stream$: Observable<any>): Observable<any> {
    return stream$.pipe(
      tap(data => {
        if (data === undefined) {
          throw new NotFoundException(this.errorMessage);
        }
      }),
    );
  }
}