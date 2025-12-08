import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { CreateSettingDto, UpdateSettingDto } from './dtos/settings.dto';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { SystemSettings } from './entities/system-settings.model';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @ApiOperation({ summary: 'Get all system settings [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Get()
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiResponse({
        status: 200,
        description: 'Settings fetched successfully',
        type: [SystemSettings],
    })
    async findAll() {
        return await this.settingsService.findAll();
    }

    @ApiOperation({ summary: 'Get setting by key [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Get(':key')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiResponse({
        status: 200,
        description: 'Setting fetched successfully',
        type: SystemSettings,
    })
    async findByKey(@Param('key') key: string) {
        return await this.settingsService.findByKey(key);
    }

    @ApiOperation({ summary: 'Create new setting [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Post()
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBody({ type: CreateSettingDto })
    @ApiResponse({
        status: 201,
        description: 'Setting created successfully',
        type: SystemSettings,
    })
    async create(@Body() dto: CreateSettingDto) {
        return await this.settingsService.create(dto);
    }

    @ApiOperation({ summary: 'Update setting [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Patch(':key')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBody({ type: UpdateSettingDto })
    @ApiResponse({
        status: 200,
        description: 'Setting updated successfully',
        type: SystemSettings,
    })
    async update(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
        return await this.settingsService.update(key, dto);
    }

    @ApiOperation({ summary: 'Delete setting [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Delete(':key')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Setting deleted successfully',
    })
    async delete(@Param('key') key: string) {
        await this.settingsService.delete(key);
        return { message: 'Setting deleted successfully' };
    }
}
