import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { UserSchema } from './modules/users/user.schema';
import { CategorySchema } from './modules/category/category.schema';
import { BookSchema } from './modules/book/book.schema';

const users = [
  {
    firstName: 'Rahul',
    lastName: 'Shrestha',
    email: 'rahul@example.com',
    phoneNumber: '9841234567',
    isActive: true,
    isDeleted: false,
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    phoneNumber: '9841987654',
    isActive: true,
    isDeleted: false,
  },
  {
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike@example.com',
    phoneNumber: '9841123456',
    isActive: true,
    isDeleted: false,
  },
];

const categories = [
  { category: 'Fiction' },
  { category: 'Non-Fiction' },
  { category: 'Self-Help' },
  { category: 'Technology' },
  { category: 'Business' },
  { category: 'Science' },
  { category: 'Biography' },
  { category: 'Education' },
];

const books = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'A practical guide to building good habits and breaking bad ones.',
    price: '750',
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Self-Help',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'A philosophical story about a shepherd boy chasing his dreams.',
    price: '600',
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Fiction',
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    description: 'A book about financial literacy and investing.',
    price: '650',
    image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Business',
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    description: 'Focus without distraction in a noisy world.',
    price: '720',
    image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Self-Help',
  },
  {
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    description: 'Classic book about success mindset.',
    price: '550',
    image_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Business',
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'How behavior affects financial decisions.',
    price: '700',
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Business',
  },
  {
    title: 'Start With Why',
    author: 'Simon Sinek',
    description: 'Great leaders inspire by focusing on purpose.',
    price: '680',
    image_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Business',
  },
  {
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    description: 'Principles for personal effectiveness.',
    price: '800',
    image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Self-Help',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'Guide to writing maintainable code.',
    price: '950',
    image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Technology',
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    description: 'Startup guide to building the future.',
    price: '720',
    image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Business',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'A brief history of humankind.',
    price: '850',
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Non-Fiction',
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'How today entrepreneurs use continuous innovation.',
    price: '700',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    isAvailable: true,
    isSold: false,
    category: 'Business',
  },
];

const migrate = async () => {
  try {
    const uri = process.env.DATABASE_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('DATABASE_URI not found in environment');
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const User = mongoose.model('users', UserSchema);
    const Category = mongoose.model('categories', CategorySchema);
    const Book = mongoose.model('books', BookSchema);

    const db = mongoose.connection.db as any;
    await db.collection('users').drop().catch(() => {});
    await db.collection('categories').drop().catch(() => {});
    await db.collection('books').drop().catch(() => {});
    console.log('Dropped existing collections');

    const createdUsers: any[] = [];
    for (const user of users) {
      const created = await User.create(user);
      createdUsers.push(created);
    }
    console.log(`Created ${createdUsers.length} users`);

    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    const categoryMap = new Map(
      createdCategories.map((c: any) => [c.category, c._id])
    );

    const booksWithOwners = books.map((book, index) => ({
      ...book,
      owner: createdUsers[index % createdUsers.length]._id,
      category: categoryMap.get(book.category)?._id,
    }));

    await Book.insertMany(booksWithOwners);
    console.log(`Created ${booksWithOwners.length} books`);

    console.log('\nMigration completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

migrate();