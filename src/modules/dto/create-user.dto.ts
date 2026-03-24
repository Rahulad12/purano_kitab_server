import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  secondName: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;
  
  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  confirmNewPassword: string;
}

export class ChangeEmailOrPhoneDto {
  @ApiProperty()
  @IsNotEmpty()
  email?: string;
 
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber?: string;


   @ApiProperty()
  @IsNotEmpty()
  password: string;
}