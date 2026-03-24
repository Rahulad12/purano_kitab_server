import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  CreateUserDto,
} from '../dto/create-user.dto';
import { GlobalResponseDto } from '../dto/global-response.dto';
import * as bcrypt from 'bcrypt';
Injectable();
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: Partial<CreateUserDto>): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password -__v -createdAt -updatedAt').exec();
    if (!user) {
      this.logger.error('user not found');
      throw new UnauthorizedException('Invalid Request');
    }
    return user;
  }
  
  // change password
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: string,
  ): Promise<GlobalResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.error('user not found');
      throw new UnauthorizedException('Invalid Request');
    }
    const isAuth = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password as string,
    );
    const isSamePasswordAsCurrent = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password as string,
    );
    if (isSamePasswordAsCurrent) {
      this.logger.error('New password cannot be same as current password');
      throw new UnauthorizedException(
        'New password cannot be same as current password',
      );
    }

    if (!isAuth) {
      this.logger.error('Invalid password');
      throw new UnauthorizedException('Your current password does not match');
    }

    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      this.logger.error('New password and confirm password do not match');
      throw new UnauthorizedException(
        'New password and confirm password do not match',
      );
    }

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await user.save();
    this.logger.log('Password changed successfully');
    return {
      statusCode: 200,
      message: 'Password changed successfully',
    };
  }

  // change email
  async changeEmail(changeEmailDto: ChangeEmailDto, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.error('user not found');
      throw new UnauthorizedException('Invalid Request');
    }
    const isAuth = await bcrypt.compare(
      changeEmailDto.password,
      user.password as string,
    );
    if (!isAuth) {
      this.logger.error('Invalid password');
      throw new UnauthorizedException('Invalid password');
    }
    user.email = changeEmailDto.email;
    await user.save();
    this.logger.log('Email changed successfully');
    return {
      statusCode: 200,
      message: 'Email changed successfully',
    };
  }

}
