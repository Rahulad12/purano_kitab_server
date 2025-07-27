import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './book.schema';
import { CreateBookDto } from '../dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async createBook(
    bookData: Partial<CreateBookDto>,
    userId: string,
  ): Promise<Book> {
    const createdBook = new this.bookModel({
      ...bookData,
      owner: userId,
    });
    return createdBook.save();
  }
  async findAllBooks(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }
  async findBookById(bookId: string): Promise<Book | null> {
    return this.bookModel.findById(bookId).exec();
  }

  async deleteBookById(bookId: string): Promise<Book | null> {
    return this.bookModel.findByIdAndDelete(bookId).exec();
  }
}
