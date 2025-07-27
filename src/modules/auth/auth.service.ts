import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';
import { AuthDto, AuthResponseDto } from '../dto/auth-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async authUser(authDto: AuthDto): Promise<AuthResponseDto> {
    this.logger.log('Auth user');
    const user = await this.userModel.findOne({ email: authDto.email });
    if (!user) {
      this.logger.error('Invalid email or password');
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    this.logger.log('User authenticated and token returned');

    return {
      accessToken,
      user: {
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
      },
    };
  }
}
