import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/db.module';
import { BookModule } from './modules/book/book.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { CategoryModule } from './modules/category/category.module';
@Module({
  imports: [
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
  ],
})
export class AppModule {}
