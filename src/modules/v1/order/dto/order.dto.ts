import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class ShopDiscount {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    shop_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    discount_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    discount_code: string;
}

class ItemProduct {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_price: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_quantity: number;
}

class ShopOrderIdsDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    shop_id: string

    @ApiProperty({
        type: [ShopDiscount]
    })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @Type(() => ShopDiscount)
    @ValidateNested({ each: true })
    shop_discounts: ShopDiscount[]


    @ApiProperty({
        type: [ItemProduct]
    })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @Type(() => ItemProduct)
    @ValidateNested({ each: true })
    item_products: ItemProduct[]
}


export class CheckoutReviewDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    cart_id: string

    @ApiProperty({
        type: [ShopOrderIdsDto]
    })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @Type(() => ShopOrderIdsDto)
    @ValidateNested({ each: true })
    shop_order_ids: ShopOrderIdsDto[]
}


class CheckOutOrderAddress {
    @ApiProperty()
    @IsString()
    street: string

    @ApiProperty()
    @IsString()
    city: string

    @ApiProperty()
    @IsString()
    state: string

    @ApiProperty()
    @IsString()
    country: string
}


class CheckOutOrderPayment {
    @ApiProperty()
    @IsString()
    payment_method: string

    @ApiProperty()
    @IsString()
    payment_status: string
}

export class CheckoutOrderSto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    cart_id: string

    @ApiProperty({
        type: [ShopOrderIdsDto]
    })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @Type(() => ShopOrderIdsDto)
    @ValidateNested({ each: true })
    shop_order_ids: ShopOrderIdsDto[]


    @ApiProperty()
    @Type(() => CheckOutOrderAddress)
    user_address: CheckOutOrderAddress

    @ApiProperty()
    @Type(() => CheckOutOrderPayment)
    user_payment: CheckOutOrderPayment
}