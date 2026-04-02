import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class GoogleOAuthCallbackDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class GoogleRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class GoogleVerifyTokenDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleAuthResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsNotEmpty()
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export class GoogleUserInfoDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  @IsOptional()
  given_name?: string;

  @IsString()
  @IsOptional()
  family_name?: string;
}
