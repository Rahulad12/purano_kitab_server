import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
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
    @Query('category') category?: string,
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
      category,
    );
  }

  @Get('/user')
  async findAllBookByUserId(@Request() req: ExpressRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }
    const books = await this.bookService.findAllBookByUserId(userId);
    return {
      success: true,
      message: 'Books fetched successfully',
      books: books,
    };
  }

  //get featured books
  @Get('featured')
  async getFeaturedBooks() {
    const books = await this.bookService.getFeaturedBooks();
    return {
      success: true,
      message: 'Featured books fetched successfully',
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
    @Request() req: ExpressRequest,
    @Body() bookData: Partial<CreateBookDto>,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return {
        message: 'User not authenticated',
        success: false,
      };
    }
    if (!bookData) {
      return {
        message: 'All Fields are Required',
        success: false,
      };
    }
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

  @Get('user/matrix')
  getSellerBooksMatrix(@Request() req: ExpressRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }
    return this.bookService.getSellerBooksMatrix(userId);
  }
}
