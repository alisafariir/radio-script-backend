import { ROLES_KEY } from '@/decorators';
import { User } from '@/entities';
import { UserRole } from '@/enums';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    // دریافت نقش‌های مورد نیاز از دکوراتور @Roles
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    // اگر نقشی تعیین نشده باشد، دسترسی مجاز است
    if (!requiredRoles) {
      return true;
    }

    // دریافت کاربر از Request
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const findedUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!user || !findedUser) {
      throw new UnauthorizedException('توکن معتبر نیست');
    }

    // بررسی نقش کاربر
    const hasRole = requiredRoles.some((role) => findedUser.role?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('شما دسترسی لازم برای انجام این عملیات را ندارید.');
    }

    return true;
  }
}
