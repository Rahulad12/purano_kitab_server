import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';
import { AuthDto, AuthResponseDto } from '../dto/auth-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async authUser(authDto: AuthDto): Promise<AuthResponseDto> {
    const user = await this.userModel.findOne({ email: authDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // Generate JWT token
    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

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
