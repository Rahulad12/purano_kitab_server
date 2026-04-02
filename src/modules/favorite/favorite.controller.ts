import { Controller, Get, Logger, Param, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FavoriteService } from './favorite.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('favorite')
export class FavoriteController {
  private readonly logger = new Logger(FavoriteController.name);
  constructor(private readonly FavoriteService: FavoriteService) {}

  // @Post(':id')
  // @ApiParam({ name: 'id', description: 'Book id' })
  // async saveBookAsFavorite(@Request() req: any, @Param('id') bookId: string) {
  //   this.logger.log(`Save book as favorite ${bookId} by user ${req.user.sub}`);
  //   const userId = req.user.sub;
  //   await this.FavoriteService.saveBookAsFavorite(bookId, userId);

  //   return {
  //     success: true,
  //     message: 'Book Saved As Favorite',
  //   };
  // }

  @Post(':id')
  @ApiParam({
    name: 'id',
    description: 'Book id',
  })
  async toggleFavorite(
    @Request() req: ExpressRequest,
    @Param('id') bookId: string,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }
    this.logger.log(`Toggle favorite ${bookId} by user ${userId}`);
    const result = await this.FavoriteService.toggleFavorite(bookId, userId);
    return {
      success: true,
      message: result.isFavorite ? 'Book favorited' : 'Book unfavorited',
      favorite: result.favorite,
    };
  }

  @Get()
  async findAllFavoritesByUser(@Request() req: ExpressRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }
    const favorites = await this.FavoriteService.findAllFavoritesByUser(userId);
    return {
      success: true,
      message: 'Favorites fetched successfully',
      favorites: favorites,
    };
  }
}
