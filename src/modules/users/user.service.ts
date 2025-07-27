import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User,UserDocument } from "./user.schema";
import { CreateUserDto } from "../dto/create-user.dto";
Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async createUser(user: Partial<CreateUserDto>): Promise<User> {
        const createdUser = new this.userModel(user);
        return createdUser.save();
      }
    async findAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
      }
}

