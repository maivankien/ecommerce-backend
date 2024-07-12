import { ApiProperty } from "@nestjs/swagger";

export class SignUpShopDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}