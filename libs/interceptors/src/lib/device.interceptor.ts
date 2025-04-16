// apps/api/src/app/core/interceptors/device.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import * as useragent from 'express-useragent';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.switchToHttp().getRequest<Request>();
    const userAgent = request.headers['user-agent'] || '';
    const deviceInfo = useragent.parse(userAgent);

    request.deviceInfo = {
      device_type: this.getDeviceType(deviceInfo),
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      ip_address: this.getClientIp(request),
    };

    return next.handle();
  }

  private getDeviceType(ua: useragent.Details): string {
    if (ua.isMobile) return 'mobile';
    if (ua.isTablet) return 'tablet';
    if (ua.isDesktop) return 'desktop';
    return 'unknown';
  }

  private getClientIp(request: Request): string {
    return request.ip || request.connection.remoteAddress;
  }
}
