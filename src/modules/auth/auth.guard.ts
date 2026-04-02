import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { url, method } = request;

    // Public authentication endpoints (no token required)
    const publicPaths = [
      { path: '/api/v1/auth/login', method: 'POST' },
      { path: '/api/v1/auth/register', method: 'POST' },
      { path: '/api/v1/auth/google/authorization-url', method: 'GET' },
      { path: '/api/v1/auth/google/callback', method: 'GET' },
      { path: '/api/v1/auth/google/verify-token', method: 'POST' },
    ];

  const isPublic = publicPaths.some(
    (route) => url.split('?')[0] === route.path && method === route.method,
  );

  if (isPublic) {
    return true;
  }

  const token = this.extractTokenFromHeader(request);

    
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
