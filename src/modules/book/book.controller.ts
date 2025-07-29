import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.schema';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateBookDto } from '../dto/create-book.dto';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getAllBooks(): Promise<Book[]> {
    return this.bookService.findAllBooks();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Book ID to get' })
  getBooksById(@Param('id') userId: string): Promise<Book | null> {
    return this.bookService.findBookById(userId);
  }

  @Post()
  @ApiBody({
    type: CreateBookDto,
  })
  createBook(
    @Request() req: any,
    @Body() bookData: Partial<CreateBookDto>,
  ): Promise<Book> {
    const userId = req.user.sub;
    return this.bookService.createBook(bookData, userId);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Book ID to delete' })
  deleteBookById(@Param('id') bookId: string): Promise<Book | null> {
    return this.bookService.deleteBookById(bookId);
  }
}
