import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';
import { AuthDto, AuthResponseDto, CreateUserDto } from '../dto/auth.dto';
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
      this.logger.error('Invalid email or password');
      throw new UnauthorizedException('Invalid email or password');
    }
    const isAuth = await bcrypt.compare(authDto.password, user.password);
    if (!isAuth) {
      this.logger.error('Invalid email or password');
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { sub: user?._id, email: user?.email };
    const accessToken = this.jwtService.sign(payload);
    this.logger.log('User authenticated and token returned');
    return {
      accessToken,
      user: {
        firstName: user?.firstName,
        lastName: user?.LastName,
        email: user?.email,
        id: user?._id.toString(),
        phoneNumber: user?.phoneNumber,
      },
    };
  }
}
