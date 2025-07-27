import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
ApiTags('Users');
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() user: Partial<CreateUserDto>): Promise<User> {
    return this.userService.createUser(user);
  }
}
