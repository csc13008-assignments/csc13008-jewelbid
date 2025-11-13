import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Patch,
    Post,
    Query,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import {
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProfileDto } from '../auth/dtos/cred.dto';
import { UpdateProfileDto } from './dtos/update-user.dto';
import { FeedbackDto } from './dtos/feedback.dto';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Get profiles by role [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Get()
    @ApiQuery({
        name: 'role',
        enum: Role,
        required: false,
        description: `Filter by role. Allowed values: ${Object.values(Role).join(', ')}`,
    })
    @ApiResponse({
        status: 200,
        description: 'Get profiles successfully',
        type: [ProfileDto],
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)
    @HttpCode(200)
    async getProfiles(@Query('role') role: Role, @Res() res: Response) {
        if (role && !Object.values(Role).includes(role)) {
            throw new BadRequestException(
                `Invalid role. Allowed values: ${Object.values(Role).join(', ')}`,
            );
        }

        const foundUsers = await this.usersService.getProfiles(role);
        res.send(foundUsers);
    }

    @ApiOperation({
        summary: 'Get profile with credentials [BIDDER, SELLER, ADMIN]',
    })
    @ApiBearerAuth('access-token')
    @Get('user')
    @ApiResponse({
        status: 200,
        description: 'Get profile successfully',
        type: ProfileDto,
    })
    @UseGuards(ATAuthGuard)
    async getMyProfile(@Request() req: any, @Res() res: Response) {
        const foundUser: {
            email: string;
            username: string;
            id: string;
            role: string;
            phone: string;
            address: string;
            image: string;
            birthdate: string;
        } = await this.usersService.getMyProfile(req.user);
        res.send(foundUser);
    }

    @ApiOperation({ summary: 'Send customer feedback' })
    @Post('feedback')
    @ApiBody({ type: FeedbackDto })
    @ApiResponse({
        status: 200,
        description: 'Send customer feedback successfully',
    })
    async sendFeedback(@Body() feedbackDto: FeedbackDto) {
        return await this.usersService.sendFeedback(feedbackDto);
    }

    @ApiOperation({ summary: 'Update profile [BIDDER, SELLER, ADMIN]' })
    @ApiBearerAuth('access-token')
    @Patch('user')
    @ApiResponse({
        status: 200,
        description: 'Update profile successfully',
        type: UpdateProfileDto,
    })
    @UseGuards(ATAuthGuard)
    async updateProfile(
        @Request() req: any,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }
}
