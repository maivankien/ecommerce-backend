import { Inject, Injectable } from "@nestjs/common";
import { Role } from "../entities/role.entity";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { RoleRepositoryInterface } from "../interfaces/role.interface";
import { CreateRoleDto } from "../dtos/role.dto";
import { convertToObjectId } from "@common/utils/common.util";


@Injectable()
export class RoleService extends BaseServiceAbstract<Role> {
    constructor(
        @Inject('RoleRepositoryInterface')
        private readonly roleRepository: RoleRepositoryInterface
    ) {
        super(roleRepository)
    }

    async createRole(payload: CreateRoleDto) {
        const grants = payload.grants.map(grant => {
            return {
                actions: grant.actions,
                attributes: grant.attributes,
                resource: convertToObjectId(grant.resource),
            }
        })

        return this.roleRepository.create({
            grants: grants,
            name: payload.name,
            slug: payload.slug,
            description: payload.description,
        } as Role)
    }

    async roleList(userId?: string, queries?: { limit?: number, offset?: number, search?: string }) {
        // const limit = queries?.limit || 30
        // const offset = queries?.offset || 0
        // const search = queries?.search || ""

        // 1. Check admin ? middleware function

        // 2. Get list of roles
        const roles = await this.roleRepository.aggregate([
            {
                $unwind: '$grants'
            },
            {
                $lookup: {
                    as: 'resource',
                    from: 'resources',
                    foreignField: '_id',
                    localField: 'grants.resource',
                }
            },
            {
                $unwind: '$resource'
            },
            {
                $project: {
                    role: '$name',
                    resouce: '$resource.name',
                    action: '$grants.actions',
                    attributes: '$grants.attributes',
                }
            },
            {
                $unwind: '$action'
            },
            {
                $project: {
                    _id: 0,
                    role: 1,
                    resource: 1,
                    action: 1,
                    attributes: 1,
                }
            }
        ])

        return roles
    }
}