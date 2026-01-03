import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import ImageKit = require('imagekit');

@Injectable()
export class ImageKitService {
    private imageKit: ImageKit;

    constructor(private configService: ConfigService) {
        this.imageKit = new ImageKit({
            publicKey: this.configService.get<string>('IMAGEKIT_PUBLIC_KEY'),
            privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY'),
            urlEndpoint: this.configService.get<string>(
                'IMAGEKIT_URL_ENDPOINT',
            ),
        });
    }

    async uploadImage(
        file: Express.Multer.File,
        folder: string,
    ): Promise<string> {
        try {
            const response = await this.imageKit.upload({
                file: file.buffer, // required
                fileName: file.originalname, // required
                folder: folder, // optional
            });
            return response.url;
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to upload image: ' + error.message,
            );
        }
    }

    async uploadBase64Image(
        base64Data: string,
        fileName: string,
        folder: string,
    ): Promise<string> {
        try {
            // Handle base64 with or without data URL prefix
            let fileData = base64Data;
            if (base64Data.includes('base64,')) {
                fileData = base64Data.split('base64,')[1];
            }

            const response = await this.imageKit.upload({
                file: fileData,
                fileName: fileName,
                folder: folder,
            });
            return response.url;
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to upload base64 image: ' + error.message,
            );
        }
    }
}
