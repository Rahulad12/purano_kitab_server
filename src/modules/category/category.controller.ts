import { CategoryService } from './category.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookCategoryDto } from '../dto/book-category-dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBody({
    type: BookCategoryDto,
  })
  createCategory(@Body() categoryData: Partial<BookCategoryDto>) {
    return this.categoryService.createCategory(categoryData);
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategory();
  }
}
