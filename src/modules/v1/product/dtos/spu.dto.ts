import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"


class ProductSpuAttributeValueDto {
    @ApiProperty()
    @IsNumber()
    value_id: number
}

class ProductSpuAttributeDto {
    @ApiProperty({
        type: Number,
        example: 100001
    })
    attribute_id: number

    @ApiProperty({
        type: [ProductSpuAttributeValueDto],
        example: [
            {
                value_id: 1
            },
            {
                value_id: 2
            }
        ]
    })
    @Type(() => ProductSpuAttributeValueDto)
    attribute_value: ProductSpuAttributeValueDto[]
}


class ProductSpuVariationDto {
    @ApiProperty()
    images: string[]

    @ApiProperty()
    name: string

    @ApiProperty()
    options: string[]
}

class ProductSpuSkuListDto {
    @ApiProperty()
    @IsArray()
    @IsNumber({}, { each: true })
    sku_tier_idx: number[]

    /**
     *  color = [RED, GREEN] = [0, 1]
     *  size = [S, M, L] = [0, 1, 2]
     * 
     *  => RED + S = [0, 0]
     *  => RED + M = [0, 1]
     */

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    sku_default: boolean

    @ApiProperty()
    @IsString()
    @IsOptional()
    sku_slug: string

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    sku_sort: number

    @ApiProperty()
    @IsString()
    sku_price: string

    @ApiProperty()
    @IsNumber()
    sku_stock: number
}

export class CreateProductSpuDto {
    @ApiProperty({
        type: String,
        example: 'Áo thun hàn quốc'
    })
    @IsString()
    name: string

    @ApiProperty({
        type: String,
        example: 'https://example.com/image.jpg'
    })
    @IsString()
    thumb: string

    @ApiProperty({
        example: 'Áo thun hàn quốc hiểu dáng Regular'
    })
    @IsString()
    description: string

    @ApiProperty({
        type: Number,
        example: 100000
    })
    @IsNumber()
    price: number

    @ApiProperty({
        type: [Number],
        example: [100001, 100002, 100003]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    category: number[]

    @ApiProperty({
        type: [ProductSpuAttributeDto],
        description: "Danh sách thuộc tính của sản phẩm",
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductSpuAttributeDto)
    attributes: ProductSpuAttributeDto[]

    @ApiProperty({
        example: 100,
        description: "Số lượng tổng của sản phẩm",
    })
    @IsNumber()
    quantity: number

    @ApiProperty({
        description: "Danh sách các biến thể của sản phẩm",
        type: [ProductSpuVariationDto],
        example: [
            {
                images: [],
                name: 'Color',
                options: ['Red', 'Green']
            },
            {
                images: [],
                name: 'Size',
                options: ['S', 'M']
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductSpuVariationDto)
    variations: ProductSpuVariationDto[]

    @ApiProperty({
        type: [ProductSpuSkuListDto],
        example: [
            {
                // Red + S
                sku_tier_idx: [0, 0],
                sku_price: '100000',
                sku_stock: 10,
            },
            {
                // Red + M
                sku_tier_idx: [0, 1],
                sku_price: '110000',
                sku_stock: 15,
            },
            {
                // Green + S
                sku_tier_idx: [1, 0],
                sku_price: '120000',
                sku_stock: 20,
            },
            {
                // Green + M
                sku_tier_idx: [1, 1],
                sku_price: '130000',
                sku_stock: 25,
            }

        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductSpuSkuListDto)
    sku_list: ProductSpuSkuListDto[]
}