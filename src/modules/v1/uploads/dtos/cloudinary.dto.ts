import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class UploadImageFromUrlDto {
    @ApiProperty({
        description: 'URL of the image to be uploaded',
        example: 'https://example.com/image.jpg',
    })
    @IsUrl()
    url: string;

    @ApiProperty({
        description: 'Cloudinary folder name where the image will be stored',
        example: '/products/shopId',
    })
    @IsString()
    folderName: string;

    @ApiProperty({
        description: 'New file name for the image',
        example: 'demo',
    })
    @IsString()
    newFileName: string;
}
