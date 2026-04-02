import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { BookSchema } from '../modules/book/book.schema';
const books = [
  {
    owner: '65f1c2b8a2b3c4d5e6f78900',
    title: 'Atomic Habits',
    author: 'James Clear',
    description:
      'A practical guide to building good habits and breaking bad ones.',
    price: '750',
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description:
      'A philosophical story about a shepherd boy chasing his dreams.',
    price: '600',
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    description: 'A book about financial literacy and investing.',
    price: '650',
    image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'Deep Work',
    author: 'Cal Newport',
    description: 'Focus without distraction in a noisy world.',
    price: '720',
    image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    description: 'Classic book about success mindset.',
    price: '550',
    image_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'How behavior affects financial decisions.',
    price: '700',
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'Start With Why',
    author: 'Simon Sinek',
    description: 'Great leaders inspire by focusing on purpose.',
    price: '680',
    image_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    description: 'Principles for personal effectiveness.',
    price: '800',
    image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'Guide to writing maintainable code.',
    price: '950',
    image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    isAvailable: true,
    isSold: false,
  },
  {
    owner: '65f1c2b8a2b3c4d5e6f78901',
    title: 'Zero to One',
    author: 'Peter Thiel',
    description: 'Startup guide to building the future.',
    price: '720',
    image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    isAvailable: true,
    isSold: false,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI as string);
    const BookModule = mongoose.model('books', BookSchema);

    await BookModule.insertMany(books);
    console.log('Database seeded successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

void seedDB();
