import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Logger } from '@nestjs/common';
import { EnvConfigDto } from './env-config.dto';

export class AppConfig {
  static async validateConfig(): Promise<void> {
    const logger = new Logger('AppConfig');

    const config = plainToInstance(EnvConfigDto, {
      PORT: process.env.PORT,
      DATABASE_URI: process.env.DATABASE_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    });

    const errors = await validate(config);
    if (errors.length > 0) {
      const errorMessages = errors.map((e) => {
        const constraints = e.constraints
          ? Object.values(e.constraints).join(', ')
          : 'invalid';
        return `${e.property}: ${constraints}`;
      });
      logger.error(`Configuration errors: ${errorMessages.join('; ')}`);
      throw new Error(
        `Configuration validation failed: ${errorMessages.join('; ')}`,
      );
    }

    logger.log('Configuration validated successfully');
  }
}
