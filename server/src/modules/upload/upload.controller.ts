import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiProperty,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ImageKitService } from './imagekit.service';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';

class UploadBase64Dto {
    @ApiProperty({ description: 'Base64 encoded image data' })
    @IsString()
    base64Data: string;

    @ApiProperty({ description: 'File name for the uploaded image' })
    @IsString()
    fileName: string;

    @ApiProperty({ description: 'Folder path in ImageKit' })
    @IsString()
    folder: string;
}

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly imageKitService: ImageKitService) {}

    @Post('base64')
    @UseGuards(ATAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload a base64 image to ImageKit' })
    async uploadBase64(@Body() dto: UploadBase64Dto): Promise<{ url: string }> {
        const url = await this.imageKitService.uploadBase64Image(
            dto.base64Data,
            dto.fileName,
            dto.folder,
        );
        return { url };
    }
}
