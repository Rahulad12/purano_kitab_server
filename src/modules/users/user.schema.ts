import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop() firstName: string;
  @Prop() secondName: string;
  @Prop() email: string;
  @Prop() phoneNumber: string;
  @Prop() password: string;
  @Prop({
    type: Boolean,
    default: true,
  })
  isActive?: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted?: boolean;
  @Prop({
    unique: true,
    type: String,
  })
  googleId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
