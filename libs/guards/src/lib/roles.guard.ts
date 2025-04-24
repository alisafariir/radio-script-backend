import { ROLES_KEY } from '@/decorators';
import { User } from '@/entities';
import { UserRole } from '@/enums';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private reflector: Reflector,
    private i18n: I18nService
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const findedUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!user || !findedUser) {
      throw new UnauthorizedException(this.i18n.t('errors.UNAUTHORIZED'));
    }

    const hasRole = requiredRoles.some((role) => findedUser.role?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(this.i18n.t('error.FORBIDDEN'));
    }

    return true;
  }
}
