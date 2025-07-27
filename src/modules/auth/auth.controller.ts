import { ApiParam } from '@nestjs/swagger';
import { AuthDto } from '../dto/auth-dto';
import { User } from '../users/user.schema';
import { AuthService } from './auth.service';
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto) {
    return this.AuthService.authUser(authDto);
  }
}
