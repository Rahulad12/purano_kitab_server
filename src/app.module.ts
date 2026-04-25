import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/db.module';
import { BookModule } from './modules/book/book.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { CategoryModule } from './modules/category/category.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 10000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 50,
      },
    ]),
    DatabaseModule,
    BookModule,
    UserModule,
    AuthModule,
    FavoriteModule,
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
