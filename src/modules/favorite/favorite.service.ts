import { InjectModel } from '@nestjs/mongoose';
import { Favorite, FavoriteDocument } from './favorite.schema';
import { Model } from 'mongoose';
Favorite;
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
  ) {}

  async saveBookAsFavorite(
    bookId: string,
    userId: Partial<string>,
  ): Promise<Favorite> {
    const createdFavBook = new this.favoriteModel({
      user: userId,
      book: bookId,
    });
    return createdFavBook.save();
  }

  async findAllFavoritesByUser(userId: string): Promise<Favorite[]> {
    return this.favoriteModel.find({ user: userId }).exec();
  }
}
