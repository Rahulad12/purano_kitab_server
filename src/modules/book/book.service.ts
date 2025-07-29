import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './book.schema';
import { CreateBookDto } from '../dto/create-book.dto';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async createBook(
    bookData: Partial<CreateBookDto>,
    userId: string,
  ): Promise<Book> {
    this.logger.log(`Create book by id ${userId}`);
    const createdBook = new this.bookModel({
      ...bookData,
      owner: userId,
    });

    if (!createdBook) {
      this.logger.error('Book not created');
      throw new Error('Book not created');
    }
    this.logger.log('Book created successfully');
    return createdBook.save();
  }
  async findAllBooks(): Promise<Book[]> {
    this.logger.log('Get all books');
    return this.bookModel.find().exec();
  }
  async findBookById(bookId: string): Promise<Book | null> {
    this.logger.log(`Get book by id ${bookId}`);
    return this.bookModel.findById(bookId).exec();
  }

  async deleteBookById(bookId: string): Promise<Book | null> {
    this.logger.log(`Delete book by id ${bookId}`);
    return this.bookModel.findByIdAndDelete(bookId).exec();
  }
}
