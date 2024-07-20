import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";
import { Clothing, ClothingDocument, Electronics, ElectronicsDocument, Furnitures, FurnituresDocument } from "../entities/product-type.entity";
import { ClothingRepositoryInterface, ElectronicsRepositoryInterface, FurnituresRepositoryInterface } from "../interface/product-type.interface";


@Injectable()
export class ClothingRepository
    extends BaseRepositoryAbstract<Clothing>
    implements ClothingRepositoryInterface {
    constructor(
        @InjectModel(Clothing.name)
        private readonly clothingModel: Model<ClothingDocument>
    ) {
        super(clothingModel)
    }
}


@Injectable()
export class ElectronicsRepository
    extends BaseRepositoryAbstract<Electronics>
    implements ElectronicsRepositoryInterface {
    constructor(
        @InjectModel(Electronics.name)
        private readonly electronicsModel: Model<ElectronicsDocument>
    ) {
        super(electronicsModel)
    }
}


@Injectable()
export class FurnituresRepository
    extends BaseRepositoryAbstract<Furnitures>
    implements FurnituresRepositoryInterface {
    constructor(
        @InjectModel(Furnitures.name)
        private readonly furnituresModel: Model<FurnituresDocument>
    ) {
        super(furnituresModel)
    }
}