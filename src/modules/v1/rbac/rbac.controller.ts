import { Response } from "express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { RoleService } from "./services/role.service";
import { CreateRoleDto } from "./dtos/role.dto";
import { CreateResourceDto } from "./dtos/resource.dto";
import { CreatedResponse, SuccessResponse } from "@common/core/success.response";
import { ResourceService } from "./services/resource.service";


@ApiTags('RBAC')
@Controller({
    version: ApiVersionEnum.V1,
})
export class RBACController {
    constructor(
        private readonly roleService: RoleService,
        private readonly resourceService: ResourceService
    ) { }

    @Post('role')
    @ApiOperation({ summary: 'Create Role' })
    async createRole(@Res() res: Response, @Body() payload: CreateRoleDto) {
        const result = await this.roleService.createRole(payload)

        return CreatedResponse(res, "Create Role Success", result)
    }

    @Get('roles')
    @ApiOperation({ summary: 'Get Role List' })
    async roleList(@Res() res: Response) {
        const result = await this.roleService.roleList()

        return SuccessResponse(res, "Get Role List Success", result)
    }

    @Post('resource')
    @ApiOperation({ summary: 'Create Resource' })
    async createResource(@Res() res: Response, @Body() payload: CreateResourceDto) {
        const result = await this.resourceService.createResource(payload)

        return CreatedResponse(res, "Create Resource Success", result)
    }

    @Get('resources')
    @ApiOperation({ summary: 'Get Resource List' })
    async resourceList(@Res() res: Response) {
        const result = await this.resourceService.resourceList()

        return SuccessResponse(res, "Get Resource List Success", result)
    }
}