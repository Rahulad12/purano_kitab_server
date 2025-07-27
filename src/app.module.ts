import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/db.module';
import { BookModule } from './modules/book/book.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [DatabaseModule, BookModule, UserModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
