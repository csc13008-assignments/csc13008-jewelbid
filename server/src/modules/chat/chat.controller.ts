import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseGuards,
    Request,
    HttpCode,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { Message } from './entities/message.model';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @ApiOperation({
        summary: 'Get chat messages for an order [BIDDER/SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Get(':orderId')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Messages fetched successfully',
        type: [Message],
    })
    async getMessages(@Param('orderId') orderId: string, @Request() req: any) {
        return await this.chatService.getMessages(orderId, req.user.id);
    }

    @ApiOperation({ summary: 'Send a message in order chat [BIDDER/SELLER]' })
    @ApiBearerAuth('access-token')
    @Post('send')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiBody({ type: SendMessageDto })
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Message sent successfully',
        type: Message,
    })
    async sendMessage(@Body() dto: SendMessageDto, @Request() req: any) {
        return await this.chatService.sendMessage(req.user.id, dto);
    }

    @ApiOperation({
        summary: 'Mark messages as read for an order [BIDDER/SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Patch(':orderId/mark-read')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Messages marked as read',
    })
    async markAsRead(@Param('orderId') orderId: string, @Request() req: any) {
        await this.chatService.markAsRead(orderId, req.user.id);
        return { message: 'Messages marked as read successfully' };
    }
}
