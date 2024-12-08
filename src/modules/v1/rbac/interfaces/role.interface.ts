import { Role } from "../entities/role.entity";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";

export type RoleRepositoryInterface = BaseRepositoryInterface<Role>;