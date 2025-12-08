import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
    @ApiProperty({
        description: 'Order ID (product ID)',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @IsUUID()
    orderId: string;

    @ApiProperty({
        description: 'Message content',
        example: 'When can you ship the product?',
    })
    @IsString()
    content: string;
}
