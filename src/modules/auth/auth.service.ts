import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';
import {
  AuthDto,
  AuthResponseDto,
  ChangePasswordDto,
  CreateUserDto,
} from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { GlobalResponseDto } from '../dto/global-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async registerUser(body: CreateUserDto): Promise<GlobalResponseDto> {
    this.logger.log('Register user');
    const existingUser = await this.userModel.findOne({ email: body.email });
    if (existingUser) {
      this.logger.error('User already exists');
      throw new UnauthorizedException('User already exists');
    }
    await this.userModel.create({
      ...body,
      password: await bcrypt.hash(body.password, 10),
    });
    this.logger.log('User created successfully');
    return {
      statusCode: 201,
      message: 'User created successfully',
    };
  }

  async authUser(authDto: AuthDto): Promise<AuthResponseDto> {
    this.logger.log('Auth user');
    const user = await this.userModel.findOne({ email: authDto.email });
    if (!user) {
      this.logger.error('user not found');
      throw new UnauthorizedException('Invalid email or password');
    }
    // const isAuth = user.password === authDto.password
    const isAuth = await bcrypt.compare(authDto.password, user.password);
    if (!isAuth) {
      this.logger.error('Invalid password');
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { sub: user?._id, email: user?.email };
    const accessToken = this.jwtService.sign(payload);
    this.logger.log('User authenticated and token returned');
    return {
      accessToken,
      user: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        id: user?._id.toString(),
        phoneNumber: user?.phoneNumber,
      },
    };
  }

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
      user.password,
    );
 const isSamePasswordAsCurrent = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
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

    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
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

  async changeEmail(
    email: string,
    userId: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.error('user not found');
      throw new UnauthorizedException('Invalid Request');
    }
    user.email = email;
    await user.save();
    this.logger.log('Email changed successfully');
    return {
      statusCode: 200,
      message: 'Email changed successfully',
    };
  }
}
