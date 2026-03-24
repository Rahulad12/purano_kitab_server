import {
  Body,
  Controller,
  Get,
  Post,
  Logger,
  HttpCode,
  Request,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { ApiTags } from '@nestjs/swagger';
import {
  ChangeEmailOrPhoneDto,
  ChangePasswordDto,
} from '../dto/create-user.dto';
ApiTags('Users');
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('all-users')
  async findAllUsers(): Promise<User[]> {
    this.logger.log('Get all users');
    return this.userService.findAllUsers();
  }

  @Get('me')
  async getUserById(@Request() req: any): Promise<User> {
    this.logger.log('Get user by id');
    return this.userService.getUserById(req.user.sub);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @Request() req: any,
  ) {
    return this.userService.changePassword(changePasswordDto, req.user.sub);
  }

  @Post('change-email-or-phone')
  @HttpCode(HttpStatus.OK)
  async changeEmailOrPhone(
    @Body(ValidationPipe) changeEmailOrPhoneDto: ChangeEmailOrPhoneDto,
    @Request() req: any,
  ) {
    return this.userService.changeEmailOrPhNumber(
      changeEmailOrPhoneDto,
      req.user.sub,
    );
  }
}
