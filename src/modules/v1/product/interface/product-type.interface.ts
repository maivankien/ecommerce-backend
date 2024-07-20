import { ClothingServiceFactory } from "@common/factories/product/clothing.factory";
import { Clothing, Electronics, Furnitures } from "../entities/product-type.entity";
import { ElectronicsServiceFactory } from "@common/factories/product/electronic.factory";
import { FurnituresServiceFactory } from "@common/factories/product/furiture.factory";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";


export type ClothingRepositoryInterface = BaseRepositoryInterface<Clothing>

export type ElectronicsRepositoryInterface = BaseRepositoryInterface<Electronics>

export type FurnituresRepositoryInterface = BaseRepositoryInterface<Furnitures>


export type ProductType = Clothing | Electronics | Furnitures

export type ProductTypeFactory = ClothingServiceFactory | ElectronicsServiceFactory | FurnituresServiceFactory