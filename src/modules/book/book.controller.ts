import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.schema';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateBookDto } from '../dto/create-book.dto';
import { Request } from 'express';
@ApiTags('books')
@Controller('books')
export class BookController {
  private readonly logger = new Logger(BookController.name);
  constructor(private readonly bookService: BookService) {}

  @Get()
  getAllBooks(): Promise<Book[]> {
    this.logger.log('Get all books');
    return this.bookService.findAllBooks();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Book ID to get' })
  getBooksById(@Param('id') userId: string): Promise<Book | null> {
    this.logger.log('Get book by id');
    return this.bookService.findBookById(userId);
  }

  @Post()
  @ApiBody({
    type: CreateBookDto,
  })
  createBook(
    @Body() req: Request,
    @Body() bookData: Partial<CreateBookDto>,
  ): Promise<Book> {
    this.logger.log('Create book');
    const userId = req.body.user._id;
    return this.bookService.createBook(bookData, userId);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Book ID to delete' })
  deleteBookById(@Param('id') bookId: string): Promise<Book | null> {
    this.logger.log('Delete book by id');
    return this.bookService.deleteBookById(bookId);
  }
}
