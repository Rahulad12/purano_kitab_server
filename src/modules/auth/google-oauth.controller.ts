import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
  UseGuards,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { GoogleOAuthService } from './google-oauth.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
  };
}

@Controller('auth/google')
export class GoogleOAuthController {
  private readonly logger = new Logger(GoogleOAuthController.name);

  constructor(
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Step 1: Get Google OAuth authorization URL
   * Frontend calls this to get the authorization URL to redirect user
   * Returns JSON response with authorization URL
   */
  @Get('authorization-url')
  @HttpCode(HttpStatus.OK)
  getAuthorizationUrl() {
    this.logger.log('Requesting Google authorization URL');
    const authorizationUrl = this.googleOAuthService.getAuthorizationUrl();
    return {
      statusCode: HttpStatus.OK,
      message: 'Authorization URL generated',
      data: {
        authorizationUrl,
      },
    };
  }

  /**
   * Step 2: Handle OAuth callback and exchange code for tokens
   * Google redirects here, then we redirect to Expo deep link
   */
  @Get('callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.redirect(
        'puranokitab://auth/error?message=Authorization code is required',
      );
    }

    try {
      const { tokens, userInfo } =
        await this.googleOAuthService.exchangeCodeForTokens(code);

      const user = await this.googleOAuthService.findOrCreateUser(
        userInfo,
        tokens.refresh_token,
      );

      const payload = { sub: user._id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      this.logger.log(`User authenticated: ${userInfo.email}`);
      console.log('Ready to redirect');
      // Redirect to Expo deep link with token
      return res.redirect(`puranokitab://auth/success?token=${accessToken}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Callback error: ${errorMessage}`);
      return res.redirect(
        `puranokitab://auth/error?message=Authentication failed`,
      );
    }
  }

  /**
   * Refresh access token using stored refresh token
   * User must be authenticated (JWT required)
   */
  @Post('refresh-token')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshAccessToken(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    this.logger.log(`Refreshing token for user: ${userId}`);

    const refreshToken = await this.googleOAuthService.getRefreshToken(userId);

    if (!refreshToken) {
      throw new BadRequestException(
        'No refresh token found. Please login again.',
      );
    }

    try {
      const tokens =
        await this.googleOAuthService.refreshAccessToken(refreshToken);

      return {
        statusCode: HttpStatus.OK,
        message: 'Access token refreshed',
        data: {
          accessToken: tokens.access_token,
          expiresIn: tokens.expires_in,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token refresh error: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Logout - revoke Google tokens and clear refresh token
   * User must be authenticated (JWT required)
   */
  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    this.logger.log(`Logging out user: ${userId}`);

    try {
      await this.googleOAuthService.clearRefreshToken(userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully logged out',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Logout error: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Verify Google ID token (optional endpoint for additional security)
   * Can be used to verify tokens on the backend
   */
  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body() body: { idToken: string }) {
    this.logger.log('Verifying Google ID token');

    if (!body?.idToken) {
      throw new BadRequestException('ID token is required');
    }

    try {
      const userInfo = await this.googleOAuthService.getUserInfoFromToken(
        body.idToken,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Token verified successfully',
        data: userInfo,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token verification error: ${errorMessage}`);
      throw error;
    }
  }
}
