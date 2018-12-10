import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const roles = ['guest', 'user', 'admin'];

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const neededRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!neededRoles) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) return false;

    return neededRoles.some(r => {
      return roles.indexOf(user.role) >= roles.indexOf(r);
    });
  }
}
