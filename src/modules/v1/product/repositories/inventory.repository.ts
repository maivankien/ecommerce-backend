import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Inventory, InventoryDocument } from "../entities/inventory.entity";
import { InventoryRepositoryInterface } from "../interface/inventory.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class InventoryRepository
    extends BaseRepositoryAbstract<Inventory>
    implements InventoryRepositoryInterface {
    constructor(
        @InjectModel(Inventory.name)
        private readonly inventoryModel: Model<InventoryDocument>
    ) {
        super(inventoryModel)
    }
}