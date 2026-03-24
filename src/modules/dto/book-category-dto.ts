import { ApiProperty } from '@nestjs/swagger';

export class BookCategoryDto {
  @ApiProperty()
  category: string;
}
