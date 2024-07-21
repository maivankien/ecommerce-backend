import { Inventory } from "../entities/inventory.entity";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";

export type InventoryRepositoryInterface = BaseRepositoryInterface<Inventory>