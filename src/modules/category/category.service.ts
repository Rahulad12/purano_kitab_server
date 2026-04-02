import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { BookCategoryDto } from '../dto/book-category-dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createCategory(
    categoryData: Partial<BookCategoryDto>,
  ): Promise<Category> {
    this.logger.log(`Create category`);
    try {
      const createCategory = await this.categoryModel.create(categoryData);
      this.logger.log(`Category created successfully`);
      return createCategory;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error creating category: ${errorMessage}`);
      throw error;
    }
  }

  async getAllCategory(): Promise<Category[]> {
    try {
      this.logger.log(`Get all categories`);
      const categories = await this.categoryModel.find();
      this.logger.log(`Categories retrieved successfully`);
      return categories;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error getting all categories: ${errorMessage}`);
      throw error;
    }
  }
}
