import { Expose } from "class-transformer";
import { ProductTypeEnum } from "@common/enums/product.enum";
import { ApiProperty, getSchemaPath, ApiExtraModels } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { IsProductAttributesValid } from "@common/validators/product-attributes.validator";


export class ClothingDto {
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    brand: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    size: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    material: string;
}

export class ElectronicsDto {
    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    manufacturer: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    model: string;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    color: number;
}

export class FurnituresDto {
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    brand: string

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    size: string

    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    material: number
}

@ApiExtraModels(ClothingDto, ElectronicsDto, FurnituresDto)
export class CreateProductDto {
    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_thumb: string;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_quantity: number;

    @Expose()
    @ApiProperty({ enum: ProductTypeEnum })
    @IsString()
    @IsNotEmpty()
    @IsEnum(ProductTypeEnum)
    product_type: ProductTypeEnum;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_description: string;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_price: number;

    @Expose()
    @ApiProperty({
        oneOf: [
            { $ref: getSchemaPath(ClothingDto) },
            { $ref: getSchemaPath(ElectronicsDto) },
            { $ref: getSchemaPath(FurnituresDto) },
        ],
    })
    @IsNotEmpty()
    @ValidateNested()
    @IsProductAttributesValid({ message: 'Product attributes do not match product type' })
    product_attributes: ClothingDto | ElectronicsDto | FurnituresDto
}
