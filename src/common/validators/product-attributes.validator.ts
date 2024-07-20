import { plainToInstance } from 'class-transformer';
import { ProductTypeEnum } from "@common/enums/product.enum";
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ClothingDto, ElectronicsDto, FurnituresDto } from '@modules/v1/product/dtos/create.dto';
import { registerDecorator, ValidationArguments, ValidationOptions, validate, ValidationError } from 'class-validator';


async function validateProduct<T extends object>(value: any, dtoClass: new () => T): Promise<string[]> {
    const instance = plainToInstance(dtoClass, value)
    const errors = await validate(instance)
    if (errors.length > 0) {
        return errors.map((err: ValidationError) => Object.values(err.constraints || {}).join(', '))
    }
    return []
}


async function checkErrorProductType(productType: ProductTypeEnum, value): Promise<string[]> {
    let errors: string[] = []
    switch (productType) {
        case ProductTypeEnum.CLOTHING:
            errors = await validateProduct(value, ClothingDto)
            break
        case ProductTypeEnum.ELECTRONICS:
            errors = await validateProduct(value, ElectronicsDto)
            break
        case ProductTypeEnum.FURNITURE:
            errors = await validateProduct(value, FurnituresDto)
            break
        default:
            throw new BadRequestException('Invalid product type')
    }
    return errors
}

export function IsProductAttributesValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isProductAttributesValid',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    const { product_type } = args.object as any
                    const errors: string[] = await checkErrorProductType(product_type, value)

                    if (errors.length > 0) {
                        throw new BadRequestException({
                            message: errors,
                            statusCode: HttpStatus.BAD_REQUEST,
                        })
                    }
                    return true
                }
            }
        })
    }
}
