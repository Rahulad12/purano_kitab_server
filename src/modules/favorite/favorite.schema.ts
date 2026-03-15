import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { HydratedDocument } from "mongoose";

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema()
export class Favorite {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        required: true,
    })
    book: mongoose.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    })
    user: mongoose.Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);