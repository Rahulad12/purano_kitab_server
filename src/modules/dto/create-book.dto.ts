import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  author: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: string;
  @ApiProperty()
  image_url: string;
}
