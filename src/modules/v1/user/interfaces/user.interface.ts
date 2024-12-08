import { User } from "../entities/user.entity";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";

export type UserRepositoryInterface = BaseRepositoryInterface<User>;