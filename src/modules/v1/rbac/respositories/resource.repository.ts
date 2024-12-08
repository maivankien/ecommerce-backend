import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";
import { Resource, ResourceDocument } from "../entities/resource.entity";
import { ResourceRepositoryInterface } from "../interfaces/resource.interface";


@Injectable()
export class ResourceRepository
    extends BaseRepositoryAbstract<Resource>
    implements ResourceRepositoryInterface {
    constructor(
        @InjectModel(Resource.name)
        private readonly resourceModel: Model<ResourceDocument>
    ) {
        super(resourceModel)
    }
}