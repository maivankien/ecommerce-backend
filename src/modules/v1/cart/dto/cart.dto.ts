import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

export class CreateCartDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_id: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_quantity: number


    @ApiProperty()
    @IsString()
    @IsOptional()
    product_shop?: string


    @ApiProperty()
    @IsString()
    @IsOptional()
    product_name?: string


    @ApiProperty()
    @IsNumber()
    @IsOptional()
    product_price?: number
}

export class UpdateCartItemProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_id: string


    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_quantity: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_old_quantity: number
}


export class UpdateCartItemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    shop_id: string

    @ApiProperty({
        type: [UpdateCartItemProductDto]
    })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateCartItemProductDto)
    item_products: UpdateCartItemProductDto[]
}

export class UpdateCartDto {
    @ApiProperty({
        type: [UpdateCartItemDto]
    })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateCartItemDto)
    shop_order_ids: UpdateCartItemDto[]
}