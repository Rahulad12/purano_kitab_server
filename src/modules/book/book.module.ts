import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from './book.schema';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
    AuthModule,
  ],

  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
