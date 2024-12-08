import { AccessControl } from 'accesscontrol';
import { RoleService } from "./services/role.service";
import { ForbiddenException, Injectable } from "@nestjs/common";


@Injectable()
export class RBACService {
    constructor(
        private readonly roleService: RoleService,
    ) {}

    async grantAccess(userId: string, action: string, resource: string, role: string) {
        const rbac = new AccessControl()

        rbac.setGrants(await this.roleService.roleList(userId))

        const permission = rbac.can(role)[action].on(resource)

        if (!permission.granted) {
            throw new ForbiddenException("You don't have permission to perform this action")
        }
    }
}