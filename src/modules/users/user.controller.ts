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
import { Request as ExpressRequest } from 'express';
import { UserService } from './user.service';
import { User } from './user.schema';
import { ApiTags } from '@nestjs/swagger';
import {
  ChangeEmailOrPhoneDto,
  ChangePasswordDto,
} from '../dto/create-user.dto';

@ApiTags('Users')
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
  async getUserById(@Request() req: ExpressRequest): Promise<User> {
    const userId = req.user?.sub;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    this.logger.log('Get user by id');
    return this.userService.getUserById(userId);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @Request() req: ExpressRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.userService.changePassword(changePasswordDto, userId);
  }

  @Post('change-email-or-phone')
  @HttpCode(HttpStatus.OK)
  async changeEmailOrPhone(
    @Body(ValidationPipe) changeEmailOrPhoneDto: ChangeEmailOrPhoneDto,
    @Request() req: ExpressRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.userService.changeEmailOrPhNumber(
      changeEmailOrPhoneDto,
      userId,
    );
  }
}
