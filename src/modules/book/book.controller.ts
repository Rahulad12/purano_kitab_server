import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
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
  getAllBooks(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('author') author?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<Book[]> {
    return this.bookService.findAllBooks(
      Number(limit),
      Number(page),
      search,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      author,
    );
  }

  @Get('/user')
  async findAllBookByUserId(@Request() req: any) {
    const userId = req.user.sub;
    const books = await this.bookService.findAllBookByUserId(userId);
    return {
      success: true,
      message: 'Books fetched successfully',
      books: books,
    };
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Book ID to get' })
  async getBooksById(@Param('id') userId: string): Promise<Book | null> {
    return this.bookService.findBookById(userId);
  }

  @Post()
  @ApiBody({
    type: CreateBookDto,
  })
  async createBook(
    @Request() req: any,
    @Body() bookData: Partial<CreateBookDto>,
  ) {
    const userId = req.user.sub;
    await this.bookService.createBook(bookData, userId);
    return {
      message: 'Book created successfully',
      success: true,
    };
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Book ID to delete' })
  deleteBookById(@Param('id') bookId: string): Promise<Book | null> {
    return this.bookService.deleteBookById(bookId);
  }
}
