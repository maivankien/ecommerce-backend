import { Resource } from "../entities/resource.entity";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";

export type ResourceRepositoryInterface = BaseRepositoryInterface<Resource>;