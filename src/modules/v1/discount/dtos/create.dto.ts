import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDiscountDto {
    @ApiProperty()
    @Expose()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    @IsDateString()
    start_date: Date;

    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    @IsDateString()
    end_date: Date;

    @ApiProperty()
    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Expose()
    @IsString()
    @IsNotEmpty()
    description: string;
    

    @ApiProperty()
    @Expose()
    @IsBoolean()
    is_active: boolean;

    @ApiProperty()
    @Expose()
    @IsNumber()
    min_order_value: number;

    @ApiProperty()
    @Expose()
    @IsArray()
    @IsNotEmpty()
    product_ids: string[];

    @ApiProperty()
    @Expose()
    @IsString()
    @IsNotEmpty()
    applies_to: string;

    @ApiProperty()
    @Expose()
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    users_used: string[];

    @ApiProperty()
    @Expose()
    @IsNumber()
    value: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    max_value: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    max_users: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    users_count: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    max_uses_per_user: number;
}