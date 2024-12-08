import { Inject } from "@nestjs/common";
import { Resource } from "../entities/resource.entity";
import { ResourceRepositoryInterface } from "../interfaces/resource.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";


export class ResourceService extends BaseServiceAbstract<Resource> {
    constructor(
        @Inject('ResourceRepositoryInterface')
        private readonly resourceRepository: ResourceRepositoryInterface
    ) {
        super(resourceRepository)
    }

    async createResource(payload: Resource) {
        return this.resourceRepository.create({
            name: payload.name,
            slug: payload.slug,
            description: payload.description,
        })
    }

    async resourceList(userId?: string, queries?: { limit?: number, offset?: number, search?: string }) {
        // const limit = queries?.limit || 30
        // const offset = queries?.offset || 0
        // const search = queries?.search || ""

        // 1. Check admin ? middleware function

        // 2. Get list of resources
        const resources = await this.resourceRepository.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$name',
                    slug: '$slug',
                    resourceId: '$_id',
                    description: '$description',
                    createdAt: '$created_at',
                }
            }
        ])

        return resources
    }

}