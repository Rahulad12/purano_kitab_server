import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/db.module';
import { BookModule } from './modules/book/book.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [DatabaseModule, BookModule,UserModule,AuthModule],
})
export class AppModule {}
