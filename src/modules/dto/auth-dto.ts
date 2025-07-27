import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UserResponseDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  secondName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  phoneNumber: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
