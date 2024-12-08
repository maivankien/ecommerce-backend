import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateResourceDto {
    @ApiProperty({
        example: 'profile'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: 'p000001'
    })
    @IsString()
    slug: string

    @ApiProperty({
        example: 'Profile global'
    })
    @IsString()
    description: string
}