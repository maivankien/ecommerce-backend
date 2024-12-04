import * as path from 'path';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BadRequestException, Injectable } from '@nestjs/common';


const MAX_FILE = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024

@Injectable()
export class ImageUploadInterceptor {
    static createInterceptor(destination: string) {
        return FilesInterceptor('files', MAX_FILE, {
            limits: { fileSize: MAX_FILE_SIZE },
            fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
                if (!RegExp(/\.(jpg|jpeg|png)$/).exec(file.originalname)) {
                    return callback(new BadRequestException('Only image files are allowed!'), false)
                }
                callback(null, true)
            },
            storage: diskStorage({
                destination: destination,
                filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
                    callback(null, `${Date.now()}${Math.random().toString(36).substring(2, 8)}${path.extname(file.originalname)}`)
                }
            })
        })
    }
}
