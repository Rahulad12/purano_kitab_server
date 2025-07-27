import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;
import { User } from '../users/user.schema';
@Schema({
  timestamps: true,
})
export class Book {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: User;
  @Prop() title: string;
  @Prop() author: string;
  @Prop() description: string;
  @Prop({
    type: Boolean,
    default: true,
  })
  isAvailable?: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  isSold?: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
