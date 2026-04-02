import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleOAuthService } from './google-oauth.service';
import { GoogleOAuthController } from './google-oauth.controller';
import { UserModule } from '../users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, GoogleOAuthService],
  controllers: [AuthController, GoogleOAuthController],
  exports: [AuthService, GoogleOAuthService, JwtModule],
})
export class AuthModule {}
