import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role, RoleDocument } from "../entities/role.entity";
import { RoleRepositoryInterface } from "../interfaces/role.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class RoleRepository
    extends BaseRepositoryAbstract<Role>
    implements RoleRepositoryInterface {
    constructor(
        @InjectModel(Role.name)
        private readonly roleModel: Model<RoleDocument>
    ) {
        super(roleModel)
    }
}