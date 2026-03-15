import { Controller, Get, Logger, Param, Post, Request } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('favorite')
export class FavoriteController {
  private readonly logger = new Logger(FavoriteController.name);
  constructor(private readonly FavoriteService: FavoriteService) {}

  @Post(':id')
  @ApiParam({ name: 'id', description: 'Book id' })
  async saveBookAsFavorite(@Request() req: any, @Param('id') bookId: string) {
    this.logger.log(`Save book as favorite ${bookId} by user ${req.user.sub}`);
    const userId = req.user.sub;
    await this.FavoriteService.saveBookAsFavorite(bookId, userId);
    
    return {
      success: true,
      message: 'Book Saved As Favorite',
    };
  }

  @Get()
  async findAllFavoritesByUser(@Request() req: any) {
    const userId = req.user.sub;
    const favorites = await this.FavoriteService.findAllFavoritesByUser(userId);
    return {
      success: true,
      message: 'Favorites fetched successfully',
      favorites: favorites,
    }
  }
}
