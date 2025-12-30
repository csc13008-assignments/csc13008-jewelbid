import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Request,
    Res,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import {
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiConsumes,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProfileDto } from '../auth/dtos/cred.dto';
import { UpdateProfileDto } from './dtos/update-user.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { FeedbackDto } from './dtos/feedback.dto';
import { CreateRatingDto, UpdateRatingDto } from './dtos/rating.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 200,
        description: 'Update profile successfully',
        type: UpdateProfileDto,
    })
    @UseGuards(ATAuthGuard)
    async updateProfile(
        @Request() req: any,
        @Body() updateProfileDto: UpdateProfileDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.usersService.updateProfile(
            req.user.id,
            updateProfileDto,
            file,
        );
    }

    @ApiOperation({
        summary: 'Create rating for another user [BIDDER, SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Post('ratings')
    @ApiBody({ type: CreateRatingDto })
    @ApiResponse({
        status: 201,
        description: 'Rating created successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    async createRating(
        @Request() req: any,
        @Body() createRatingDto: CreateRatingDto,
    ) {
        return await this.usersService.createRating(
            createRatingDto,
            req.user.id,
        );
    }

    @ApiOperation({ summary: 'Update existing rating [BIDDER, SELLER]' })
    @ApiBearerAuth('access-token')
    @Patch('ratings/:id')
    @ApiBody({ type: UpdateRatingDto })
    @ApiResponse({
        status: 200,
        description: 'Rating updated successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    async updateRating(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateRatingDto: UpdateRatingDto,
    ) {
        return await this.usersService.updateRating(
            id,
            req.user.id,
            updateRatingDto,
        );
    }

    @ApiOperation({ summary: 'Delete rating [BIDDER, SELLER]' })
    @ApiBearerAuth('access-token')
    @Delete('ratings/:id')
    @ApiResponse({
        status: 200,
        description: 'Rating deleted successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    async deleteRating(@Request() req: any, @Param('id') id: string) {
        return await this.usersService.deleteRating(id, req.user.id);
    }

    @ApiOperation({ summary: 'Get ratings for a user' })
    @Get(':id/ratings')
    @ApiResponse({
        status: 200,
        description: 'Ratings fetched successfully',
    })
    async getRatingsForUser(@Param('id') id: string) {
        return await this.usersService.getRatingsForUser(id);
    }

    @ApiOperation({ summary: 'Get rating statistics for a user' })
    @Get(':id/rating-stats')
    @ApiResponse({
        status: 200,
        description: 'Rating stats fetched successfully',
    })
    async getUserRatingStats(@Param('id') id: string) {
        return await this.usersService.getUserRatingStats(id);
    }

    @ApiOperation({
        summary: 'Get my ratings given to others [BIDDER, SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Get('user/my-ratings')
    @ApiResponse({
        status: 200,
        description: 'My ratings fetched successfully',
    })
    @UseGuards(ATAuthGuard)
    async getMyRatings(@Request() req: any) {
        return await this.usersService.getRatingsByUser(req.user.id);
    }

    @ApiOperation({ summary: 'Request upgrade to seller [BIDDER]' })
    @ApiBearerAuth('access-token')
    @Post('upgrade-request')
    @ApiResponse({
        status: 200,
        description: 'Upgrade request submitted successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER)
    async requestUpgrade(@Request() req: any) {
        return await this.usersService.requestUpgrade(req.user.id);
    }

    @ApiOperation({ summary: 'Get all upgrade requests [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Get('upgrade-requests')
    @ApiResponse({
        status: 200,
        description: 'Upgrade requests fetched successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getUpgradeRequests() {
        return await this.usersService.getUpgradeRequests();
    }

    @ApiOperation({ summary: 'Approve upgrade request [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Post('upgrade-requests/:id/approve')
    @ApiResponse({
        status: 200,
        description: 'Upgrade request approved successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async approveUpgradeRequest(@Param('id') id: string) {
        return await this.usersService.approveUpgradeRequest(id);
    }

    @ApiOperation({ summary: 'Reject upgrade request [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Post('upgrade-requests/:id/reject')
    @ApiResponse({
        status: 200,
        description: 'Upgrade request rejected successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async rejectUpgradeRequest(@Param('id') id: string) {
        return await this.usersService.rejectUpgradeRequest(id);
    }

    @ApiOperation({ summary: 'Update user role [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Patch(':userId/role')
    @ApiResponse({
        status: 200,
        description: 'User role updated successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async updateUserRole(
        @Param('userId') userId: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return await this.usersService.updateUserRole(
            userId,
            updateRoleDto.role,
        );
    }

    @ApiOperation({ summary: 'Delete user [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Delete(':userId')
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async deleteUser(@Param('userId') userId: string) {
        return await this.usersService.deleteUser(userId);
    }
}
