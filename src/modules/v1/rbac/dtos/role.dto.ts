import { ApiProperty } from "@nestjs/swagger";
import { RoleNameEnum } from "@common/enums/role.enum";
import { IsEnum, IsString } from "class-validator";


export class Grant {
    @ApiProperty({
        example: "resourceId",
        type: String
    })
    @IsString()
    resource: string

    @ApiProperty({
        description: "List of actions permitted by this grant",
        example: ["read:any", "update:any", "delete:any"],
        isArray: true,
        type: String,
    })
    actions: string[]

    @ApiProperty({
        description: "Attributes that can be accessed with this grant",
        example: "*",
    })
    attributes: string
}

export class CreateRoleDto {
    @ApiProperty({
        description: "The name of the role",
        enum: RoleNameEnum,
        example: RoleNameEnum.ADMIN,
    })
    @IsEnum(RoleNameEnum)
    name: RoleNameEnum

    @ApiProperty({
        example: "s00001",
    })
    @IsString()
    slug: string

    @ApiProperty({
        description: "A brief description of the role",
        example: "Administrator role with full permissions",
    })
    @IsString()
    description: string

    @ApiProperty({
        description: "List of grants associated with the role",
        type: [Grant],
    })
    grants: Grant[]
}
