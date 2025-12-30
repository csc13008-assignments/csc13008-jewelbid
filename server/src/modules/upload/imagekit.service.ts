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
}
