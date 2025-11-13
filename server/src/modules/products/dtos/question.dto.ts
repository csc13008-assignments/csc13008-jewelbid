import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsUUID } from 'class-validator';

export class AskQuestionDto {
    @ApiProperty({
        description: 'Product ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @IsUUID()
    productId: string;

    @ApiProperty({
        description: 'Question content',
        example: 'Is this product authentic? Does it come with certificate?',
    })
    @IsString()
    @MinLength(10)
    question: string;
}

export class AnswerQuestionDto {
    @ApiProperty({
        description: 'Answer content',
        example:
            'Yes, this product is 100% authentic and comes with GIA certificate.',
    })
    @IsString()
    @MinLength(10)
    answer: string;
}
