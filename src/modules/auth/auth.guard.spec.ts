import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockContext = (
    url: string,
    method: string,
    authorization?: string,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          url,
          method,
          headers: authorization ? { authorization } : {},
          user: undefined,
        }),
      }),
    } as any;
  };

  describe('canActivate', () => {
    it('should allow public routes without token', async () => {
      const publicRoutes = [
        { url: '/api/v1/auth/login', method: 'POST' },
        { url: '/api/v1/auth/register', method: 'POST' },
        { url: '/api/v1/auth/google/authorization-url', method: 'GET' },
        { url: '/api/v1/auth/google/callback', method: 'GET' },
        { url: '/api/v1/auth/google/verify-token', method: 'POST' },
      ];

      for (const route of publicRoutes) {
        const context = createMockContext(route.url, route.method);
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }
    });

    it('should throw UnauthorizedException if no token provided for protected route', async () => {
      const context = createMockContext('/api/v1/books', 'GET');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));
      const context = createMockContext(
        '/api/v1/books',
        'GET',
        'Bearer invalid-token',
      );

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return true if token is valid', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValue({ sub: 'user-id', email: 'test@example.com' });
      const context = createMockContext(
        '/api/v1/books',
        'GET',
        'Bearer valid-token',
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: process.env.JWT_SECRET,
      });
    });
  });
});
