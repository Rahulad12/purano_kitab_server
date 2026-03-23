import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ChangeEmailDto, ChangePasswordDto, CreateUserDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) body: CreateUserDto) {
    return this.authService.registerUser(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.authUser(authDto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @Request() req: any,
  ) {
    return this.authService.changePassword(changePasswordDto, req.user.sub);
  }

  @Post('change-email')
  @HttpCode(HttpStatus.OK)
  async changeEmail(
    @Body(ValidationPipe) changeEmailDto: ChangeEmailDto,
    @Request() req: any,
  ) {
    return this.authService.changeEmail(changeEmailDto.email, req.user.sub);
  }
}
