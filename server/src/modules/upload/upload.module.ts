import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageKitService } from './imagekit.service';
import { UploadController } from './upload.controller';

@Global()
@Module({
    imports: [ConfigModule],
    controllers: [UploadController],
    providers: [ImageKitService],
    exports: [ImageKitService],
})
export class UploadModule {}
