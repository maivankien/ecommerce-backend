import { Type } from "class-transformer";
import { ProductTypeEnum } from "@common/enums/product.enum";
import { ApiProperty, getSchemaPath, ApiExtraModels } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { IsProductAttributesValid } from "@common/validators/product-attributes.validator";


export class ClothingDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    brand: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    size: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    material: string;
}

export class ElectronicsDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    manufacturer: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    model: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    color: number;
}

export class FurnituresDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    brand: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    size: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    material: number
}

@ApiExtraModels(ClothingDto, ElectronicsDto, FurnituresDto)
export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_thumb: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_quantity: number;

    @ApiProperty({ enum: ProductTypeEnum })
    @IsString()
    @IsNotEmpty()
    @IsEnum(ProductTypeEnum)
    product_type: ProductTypeEnum;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_description: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_price: number;

    @ApiProperty({
        oneOf: [
            { $ref: getSchemaPath(ClothingDto) },
            { $ref: getSchemaPath(ElectronicsDto) },
            { $ref: getSchemaPath(FurnituresDto) },
        ],
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Object)
    @IsProductAttributesValid({ message: 'Product attributes do not match product type' })
    product_attributes: ClothingDto | ElectronicsDto | FurnituresDto
}
