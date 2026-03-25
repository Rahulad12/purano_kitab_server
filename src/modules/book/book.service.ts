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
    const savedBook = await createdBook.save();
    return savedBook;
  }

  async findAllBooks(
    pageLimit: number,
    page: number,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    author?: string,
    category?: string,
  ): Promise<Book[]> {
    this.logger.log('Get all books');

    const query: Record<string, any> = {};

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by author (case-insensitive)
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    return this.bookModel
      .find(query)
      .populate({
        path: 'owner',
        select: 'name email',
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageLimit)
      .limit(pageLimit)
      .exec();
  }

  async findBookById(bookId: string): Promise<Book | null> {
    this.logger.log(`Get book by id ${bookId}`);
    return this.bookModel
      .findById(bookId)
      .populate({
        path: 'owner',
        select: '-password -__v -createdAt -updatedAt -_id',
      })
      .exec();
  }

  async findAllBookByUserId(userId: string): Promise<Book[]> {
    this.logger.log(`Get all books by user id ${userId}`);
    return this.bookModel
      .find({ owner: userId })
      .populate({
        path: 'owner',
        select: '-password -__v -createdAt -updatedAt -_id',
      })
      .exec();
  }

  async deleteBookById(bookId: string): Promise<Book | null> {
    this.logger.log(`Delete book by id ${bookId}`);
    return this.bookModel.findByIdAndDelete(bookId).exec();
  }

  /**
   * Get featured books
   * this will return book who are most favorite, like more than 5 uers
   */
  async getFeaturedBooks(): Promise<Book[]> {
  this.logger.log('Get featured books');
  try {
    const books = await this.bookModel.aggregate([
      {
        $lookup: {
          from: "favorites",
          localField: "_id",   
          foreignField: "book",
          as: "favoritedBy",
        },
      },
      {
        // Only books favorited by 5 or more users
        $match: {
          $expr: { $gte: [{ $size: "$favoritedBy" }, 1] },
        },
      },
      {
        $project: {
          favoritedBy: 0,
        },
      },
      {
        $sort: { favoriteCount: -1 },
      },
    ]);
    return books;
  } catch (error) {
    this.logger.error(`Error getting featured books: ${error.message}`);
    throw error;
  }
}
}
