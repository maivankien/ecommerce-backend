import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationDto {
    @ApiProperty({
        required: false,
        default: 1,
        description: 'Page number',
        minimum: 1,
        type: 'integer',
    })
    @IsInt()
    @IsOptional()
    @Min(1, { message: 'Page must be greater than or equal to 1' })
    @Type(() => Number)
    page?: number = 1

    @ApiProperty({
        required: false,
        default: 10,
        description: 'Limit number of items per page',
        minimum: 1,
        maximum: 100,
        type: 'integer',
    })
    @IsInt()
    @IsOptional()
    @Min(1, { message: 'Limit must be greater than or equal to 1' })
    @Max(200, { message: 'Limit must be less than or equal to 200' })
    @Type(() => Number)
    limit?: number = 10
}
