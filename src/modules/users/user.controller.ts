import { Body, Controller, Get, Post, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
ApiTags('Users');
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUsers(): Promise<User[]> {
    Logger.log('Get all users');
    return this.userService.findAllUsers();
  }

  // @Post()
  // @ApiBody({ type: CreateUserDto })
  // async createUser(@Body() user: Partial<CreateUserDto>): Promise<User> {
  //   this.logger.log('Create user');
  //   return this.userService.createUser(user);
  // }
}
