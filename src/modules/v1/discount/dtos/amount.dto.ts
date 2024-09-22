import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetDiscountAmountProductDto {
    @ApiProperty({ description: 'ID của sản phẩm' })
    @IsNotEmpty()
    @IsString()
    product_id: string

    @ApiProperty({ description: 'Số lượng sản phẩm' })
    @IsNotEmpty()
    @IsNumber()
    product_quantity: number

    @ApiProperty({ description: 'Giá của sản phẩm' })
    @IsNotEmpty()
    @IsNumber()
    product_price: number
}

export class GetDiscountAmountDto {
    @ApiProperty({ description: 'ID của mã giảm giá' })
    @IsNotEmpty()
    @IsString()
    code_id: string

    @ApiProperty({ description: 'ID của cửa hàng' })
    @IsNotEmpty()
    @IsString()
    shop_id: string

    @ApiProperty({
        description: 'Danh sách sản phẩm áp dụng mã giảm giá',
        type: [GetDiscountAmountProductDto]
    })
    @IsNotEmpty()
    @Type(() => GetDiscountAmountProductDto)
    products: GetDiscountAmountProductDto[]
}
