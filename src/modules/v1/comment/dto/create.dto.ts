import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_id: string


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string


    @ApiProperty()
    @IsString()
    @IsOptional()
    parent_id: string
}