import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "@providers/uploads/cloudinary/cloudinary.provider";
import { CloudinaryService } from "./services/cloudinary.service";
import { CloudinaryController } from "./controllers/cloudinary.controller";

@Module({
    imports: [],
    controllers: [CloudinaryController],
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryProvider, CloudinaryService]
})
export class UploadModule {}