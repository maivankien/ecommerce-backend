import { Response } from "express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CloudinaryService } from "../services/cloudinary.service";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { UploadImageFromUrlDto } from "../dtos/cloudinary.dto";
import { SuccessResponse } from "@common/core/success.response";
import { ImageUploadInterceptor } from "@common/interceptors/image-upload.interceptor";
import { Controller, Post, Body, Res, UseInterceptors, UploadedFiles } from "@nestjs/common";


@Controller({
    path: 'cloudinary',
    version: ApiVersionEnum.V1,
})
@ApiTags('Upload Cloudinary')
export class CloudinaryController {
    constructor(
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Post('upload-image-from-url')
    async uploadImageFromUrl(@Body() uploadImageDto: UploadImageFromUrlDto, @Res() res: Response) {
        const { url, folderName, newFileName } = uploadImageDto

        const result = await this.cloudinaryService.uploadImageFromUrl(url, folderName, newFileName)

        return SuccessResponse(res, "Success", result)
    }

    @Post('upload-image-from-file')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    }
                }
            }
        }
    })
    @UseInterceptors(ImageUploadInterceptor.createInterceptor('./uploads/images'))
    async uploadImageFromFile(@Res() res: Response, @UploadedFiles() files: Express.Multer.File[]) {
        const results = await Promise.all(files.map(async file => {
            return await this.cloudinaryService.uploadImageFromUrl(file.path, 'products/shopId', file.filename)
        }))

        return SuccessResponse(res, "Success", results)
    }
}
