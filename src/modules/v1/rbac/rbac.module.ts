import { Module } from "@nestjs/common";
import { RBACController } from "./rbac.controller";
import { RoleService } from "./services/role.service";
import { RoleRepository } from "./respositories/role.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "./entities/role.entity";
import { ResourceService } from "./services/resource.service";
import { ResourceRepository } from "./respositories/resource.repository";
import { Resource, ResourceSchema } from "./entities/resource.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Role.name, schema: RoleSchema },
            { name: Resource.name, schema: ResourceSchema }
        ])
    ],
    controllers: [
        RBACController
    ],
    providers: [
        RoleService,
        {
            provide: 'RoleRepositoryInterface',
            useClass: RoleRepository
        },
        ResourceService, {
            provide: 'ResourceRepositoryInterface',
            useClass: ResourceRepository
        }
    ],
})
export class RBACModule { }