import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles } from 'src/auth/guards/roles.enum';

/**
 * Guard whether api endpoint can be accessed by the current user
 */

export class UserResourceGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const userId = req.params.userId;

    // allow userId shortcut
    if (userId === 'me') return true;

    // requested user id must match current user id
    // or user must be admin
    if (user.role === UserRoles.ADMIN || userId === user._id) return true;

    return false;
  }

}