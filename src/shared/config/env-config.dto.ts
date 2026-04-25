import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class EnvConfigDto {
  @IsString()
  @IsOptional()
  PORT?: string;

  @IsString()
  @IsNotEmpty({ message: 'DATABASE_URI is required' })
  @Transform(({ value }) => value || process.env.DATABASE_URI)
  DATABASE_URI?: string;

  @IsString()
  @IsNotEmpty({ message: 'JWT_SECRET is required' })
  @Transform(({ value }) => value || process.env.JWT_SECRET)
  JWT_SECRET?: string;

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_SECRET?: string;

  @IsString()
  @IsOptional()
  GOOGLE_REDIRECT_URI?: string;
}
