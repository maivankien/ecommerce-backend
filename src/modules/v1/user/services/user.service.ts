import { Inject, Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { UserRepositoryInterface } from "../interfaces/user.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";


@Injectable()
export class UserService extends BaseServiceAbstract<User> {
    constructor(
        @Inject('UserRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface
    ) {
        super(userRepository)
    }
}