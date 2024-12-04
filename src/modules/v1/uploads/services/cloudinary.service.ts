import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from 'cloudinary';


@Injectable()
export class CloudinaryService {

    async uploadImageFromUrl(urlImage: string, folderName: string, newFileName: string) {
        try {
            const result = await cloudinary.uploader.upload(urlImage, {
                public_id: newFileName,
                folder: folderName
            })

            return {
                url: result.secure_url,
                thumbnail: cloudinary.url(result.public_id, {
                    width: 150,
                    height: 150,
                    format: 'jpg'
                })
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
}