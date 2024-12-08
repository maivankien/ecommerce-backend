import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserRepositoryInterface } from "../interfaces/user.interface";
import { User, UserDocument } from "../entities/user.entity";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class UserRepository
    extends BaseRepositoryAbstract<User>
    implements UserRepositoryInterface {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {
        super(userModel)
    }
}