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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { Category } from './entities/category.model';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @ApiOperation({ summary: 'Get all active categories (flat list)' })
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Categories fetched successfully',
        type: [Category],
    })
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @ApiOperation({
        summary: 'Get category tree (2-level hierarchy with parent-children)',
    })
    @Get('tree')
    @ApiResponse({
        status: 200,
        description: 'Category tree fetched successfully',
        type: [Category],
    })
    async getTree() {
        return await this.categoriesService.findTree();
    }

    @ApiOperation({ summary: 'Get top-level categories only' })
    @Get('top-level')
    @ApiResponse({
        status: 200,
        description: 'Top-level categories fetched successfully',
        type: [Category],
    })
    async getTopLevel() {
        return await this.categoriesService.getTopLevelCategories();
    }

    @ApiOperation({ summary: 'Get category by ID' })
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Category fetched successfully',
        type: Category,
    })
    async findOne(@Param('id') id: string) {
        return await this.categoriesService.findOne(id);
    }

    @ApiOperation({ summary: 'Get category by slug' })
    @Get('slug/:slug')
    @ApiResponse({
        status: 200,
        description: 'Category fetched successfully',
        type: Category,
    })
    async findBySlug(@Param('slug') slug: string) {
        return await this.categoriesService.findBySlug(slug);
    }

    @ApiOperation({ summary: 'Create a new category [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Post()
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully',
        type: Category,
    })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoriesService.create(createCategoryDto);
    }

    @ApiOperation({ summary: 'Update a category [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Patch(':id')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({
        status: 200,
        description: 'Category updated successfully',
        type: Category,
    })
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return await this.categoriesService.update(id, updateCategoryDto);
    }

    @ApiOperation({ summary: 'Delete a category [ADMIN]' })
    @ApiBearerAuth('access-token')
    @Delete(':id')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Category deleted successfully',
    })
    async remove(@Param('id') id: string) {
        await this.categoriesService.remove(id);
        return { message: 'Category deleted successfully' };
    }
}
