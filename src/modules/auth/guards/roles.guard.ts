// src/modules/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.get<string[]>('roles', context.getHandler());
    if (!rolesPermitidos) return true; // no se requiere rol

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return rolesPermitidos.some(role => user.roles.includes(role));
  }
}
