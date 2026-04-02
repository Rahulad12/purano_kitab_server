import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.schema';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { AuthModule } from '../auth/auth.module';
import { FavoriteModule } from '../favorite/favorite.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    AuthModule,
    FavoriteModule,
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
