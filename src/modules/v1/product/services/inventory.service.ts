import { Inject, Injectable } from "@nestjs/common";
import { Inventory } from "../entities/inventory.entity";
import { InventoryRepositoryInterface } from "../interface/inventory.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";


@Injectable()
export class InventoryService extends BaseServiceAbstract<Inventory> {
    constructor(
        @Inject('InventoryRepositoryInterface')
        private readonly inventoryRepository: InventoryRepositoryInterface,
    ) {
        super(inventoryRepository)
    }
}