import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class AddStockDto {
    @ApiProperty()
    @IsNotEmpty()
    stock: number

    
    @ApiProperty()
    @IsString()
    product_id: string


    @ApiProperty()
    @IsString()
    location: string
}