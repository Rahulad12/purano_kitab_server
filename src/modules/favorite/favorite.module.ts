import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Favorite, FavoriteSchema } from "./favorite.schema";
import { FavoriteService } from "./favorite.service";
import { FavoriteController } from "./favorite.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }]),
        AuthModule
    ],
    controllers: [FavoriteController],
    providers: [FavoriteService],
    exports:[MongooseModule]
})
export class FavoriteModule {}