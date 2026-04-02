import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  id_token: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly logger = new Logger(GoogleOAuthService.name);
  private oauth2Client: OAuth2Client;
  private readonly httpClient: AxiosInstance;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly googleTokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly googleUserinfoUrl =
    'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.clientId = this.configService.get('GOOGLE_CLIENT_ID')!;
    this.clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET')!;
    this.redirectUri = this.configService.get('GOOGLE_REDIRECT_URI')!;

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      this.logger.error('Missing Google OAuth configuration');
      throw new Error('Google OAuth configuration is incomplete');
    }

    this.oauth2Client = new OAuth2Client(
      this.clientId,
      this.clientSecret,
      this.redirectUri,
    );

    this.httpClient = axios.create({
      timeout: 10000,
    });
  }

  /**
   * Generate Google OAuth authorization URL
   * Frontend should redirect user to this URL
   * @returns OAuth authorization URL
   */
  getAuthorizationUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });

    this.logger.debug('Generated Google OAuth authorization URL');
    return url;
  }

  /**
   * Exchange authorization code for tokens
   * @param code Authorization code from Google
   * @returns Tokens and user info
   */
  async exchangeCodeForTokens(
    code: string,
  ): Promise<{ tokens: GoogleTokenResponse; userInfo: GoogleUserInfo }> {
    try {
      this.logger.log('Exchanging authorization code for tokens');

      if (!code) {
        throw new BadRequestException('Authorization code is required');
      }

      const { tokens } = await this.oauth2Client.getToken(code);

      if (!tokens || !tokens.id_token) {
        throw new UnauthorizedException('Failed to obtain tokens from Google');
      }

      this.oauth2Client.setCredentials(tokens);

      const userInfo = await this.getUserInfoFromToken(tokens.id_token);

      this.logger.log(
        `Successfully exchanged code for tokens for user: ${userInfo.email}`,
      );

      return {
        tokens: {
          access_token: tokens.access_token!,
          refresh_token: tokens.refresh_token!,
          expires_in: tokens.expiry_date
            ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
            : 3600,
          token_type: 'Bearer',
          id_token: tokens.id_token,
        },
        userInfo,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error exchanging code for tokens: ${errorMessage}`);
      throw new UnauthorizedException(
        'Failed to authenticate with Google. Please try again.',
      );
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken Google refresh token
   * @returns New access token
   */
  async refreshAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
    try {
      this.logger.log('Refreshing Google access token');

      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();

      if (!credentials.access_token) {
        throw new UnauthorizedException('Failed to refresh access token');
      }

      this.logger.log('Successfully refreshed access token');

      return {
        access_token: credentials.access_token,
        expires_in: credentials.expiry_date
          ? Math.floor((credentials.expiry_date - Date.now()) / 1000)
          : 3600,
        token_type: 'Bearer',
        id_token: credentials.id_token || '',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error refreshing access token: ${errorMessage}`);
      throw new UnauthorizedException('Failed to refresh access token');
    }
  }

  /**
   * Decode and verify ID token to get user info
   * @param idToken Google ID token
   * @returns Decoded user information
   */
  async getUserInfoFromToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return {
        sub: payload.sub,
        email: payload.email!,
        email_verified: payload.email_verified!,
        name: payload.name!,
        picture: payload.picture!,
        given_name: payload.given_name!,
        family_name: payload.family_name!,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error decoding ID token: ${errorMessage}`);
      throw new UnauthorizedException('Invalid ID token');
    }
  }

  /**
   * Revoke Google tokens (logout)
   * @param accessToken Google access token to revoke
   */
  async revokeToken(accessToken: string): Promise<void> {
    try {
      this.logger.log('Revoking Google access token');

      await this.httpClient.post(
        `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
      );

      this.logger.log('Successfully revoked access token');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Error revoking token: ${errorMessage}`);
    }
  }

  /**
   * Find or create user from Google info and save refresh token
   * @param userInfo Google user information
   * @param refreshToken Google refresh token
   * @returns Created or found user document
   */
  async findOrCreateUser(
    userInfo: GoogleUserInfo,
    refreshToken?: string,
  ): Promise<UserDocument> {
    try {
      this.logger.log(`Processing user: ${userInfo.email}`);

      let user = await this.userModel.findOne({
        $or: [{ googleId: userInfo.sub }, { email: userInfo.email }],
      });

      if (user) {
        if (refreshToken && !user.googleRefreshToken) {
          user.googleRefreshToken = refreshToken;
        }
        if (!user.googleId) {
          user.googleId = userInfo.sub;
        }
        await user.save();
        this.logger.log(`User updated: ${userInfo.email}`);
      } else {
        user = await this.userModel.create({
          email: userInfo.email,
          googleId: userInfo.sub,
          googleRefreshToken: refreshToken,
          firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || '',
          lastName: userInfo.family_name || userInfo.name?.split(' ')[1] || '',
          isActive: true,
          isDeleted: false,
        });
        this.logger.log(`New user created: ${userInfo.email}`);
      }

      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error processing user: ${errorMessage}`);
      throw new UnauthorizedException('Failed to process user information');
    }
  }

  /**
   * Get user by Google ID
   * @param googleId Google user ID
   * @returns User document or null
   */
  async getUserByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId });
  }

  /**
   * Get refresh token by user ID
   * @param userId MongoDB user ID
   * @returns Refresh token or null
   */
  async getRefreshToken(userId: string): Promise<string | null> {
    const user = await this.userModel.findById(userId);
    return user?.googleRefreshToken || null;
  }

  /**
   * Clear refresh token (logout)
   * @param userId MongoDB user ID
   */
  async clearRefreshToken(userId: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $unset: { googleRefreshToken: 1 } },
    );
    this.logger.log(`Refresh token cleared for user: ${userId}`);
  }
}
