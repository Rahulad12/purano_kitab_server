import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { Favorite } from '../favorite/favorite.schema';

describe('BookService', () => {
  let service: BookService;

  const mockBook = {
    _id: 'book-id-123',
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test description',
    price: '500',
    image_url: 'https://example.com/image.jpg',
    owner: 'user-id-123',
    isAvailable: true,
    isSold: false,
    category: 'Fiction',
    save: jest.fn().mockResolvedValue(true),
  };

  const mockBookModel = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockBook]),
    }),
    findOne: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockBook),
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockBook),
    }),
    aggregate: jest.fn().mockReturnValue([]),
  };

  const mockFavoriteModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
        {
          provide: getModelToken(Favorite.name),
          useValue: mockFavoriteModel,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllBooks', () => {
    it('should return books', async () => {
      const result = await service.findAllBooks(10, 1);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter by search', async () => {
      await service.findAllBooks(10, 1, 'Atomic');
      expect(mockBookModel.find).toHaveBeenCalled();
    });
  });

  describe('findBookById', () => {
    it('should return book by id', async () => {
      const result = await service.findBookById('book-id-123');
      expect(result).toEqual(mockBook);
    });
  });

  describe('getFeaturedBooks', () => {
    it('should return featured books', async () => {
      const result = await service.getFeaturedBooks();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
