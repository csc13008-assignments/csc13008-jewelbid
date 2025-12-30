import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpCode,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PlaceBidDto } from './dtos/bid.dto';
import { AddToWatchlistDto } from './dtos/watchlist.dto';
import { AskQuestionDto, AnswerQuestionDto } from './dtos/question.dto';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { JewelryCategory } from './entities/product.model';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { ImageKitService } from '../upload/imagekit.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly imageKitService: ImageKitService,
    ) {}

    @ApiOperation({
        summary:
            'Get home page products (top 5 ending soon, top 5 by bid count, top 5 by price)',
    })
    @Get('homepage')
    @ApiResponse({
        status: 200,
        description: 'Home page products fetched successfully',
    })
    async getHomePageProducts() {
        return await this.productsService.getHomePageProducts();
    }

    @ApiOperation({
        summary: 'Get all products for admin (including ended) [ADMIN]',
    })
    @ApiBearerAuth('access-token')
    @Get('admin/all')
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 100 })
    @ApiResponse({
        status: 200,
        description: 'All products fetched successfully for admin',
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getAllProductsForAdmin(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 100,
    ) {
        return await this.productsService.getAllProductsForAdmin(page, limit);
    }

    @ApiOperation({
        summary: 'Get all active products with pagination and filters',
    })
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiQuery({
        name: 'category',
        required: false,
        type: String,
        example: 'Ring',
    })
    @ApiQuery({
        name: 'brand',
        required: false,
        type: String,
        example: 'Cartier',
    })
    @ApiQuery({
        name: 'material',
        required: false,
        type: String,
        example: 'Gold',
    })
    @ApiQuery({
        name: 'targetAudience',
        required: false,
        type: String,
        example: 'Women',
    })
    @ApiQuery({
        name: 'auctionStatus',
        required: false,
        type: String,
        example: 'ending-soon',
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        type: String,
        example: 'newest',
        description:
            'Sort by: newest, oldest, price-asc, price-desc, popular, ending-soon',
    })
    @ApiResponse({
        status: 200,
        description: 'Products fetched successfully',
    })
    async getAllProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Query('category') category?: string,
        @Query('brand') brand?: string,
        @Query('material') material?: string,
        @Query('targetAudience') targetAudience?: string,
        @Query('auctionStatus') auctionStatus?: string,
        @Query('sortBy') sortBy?: string,
    ) {
        return await this.productsService.getAllProducts(
            page,
            limit,
            {
                category,
                brand,
                material,
                targetAudience,
                auctionStatus,
            },
            sortBy,
        );
    }

    @ApiOperation({ summary: 'Get products by category ID or slug' })
    @Get('category/:categoryId')
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiResponse({
        status: 200,
        description: 'Products fetched successfully',
    })
    async getProductsByCategory(
        @Param('categoryId') categoryId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
    ) {
        return await this.productsService.getProductsByCategory(
            categoryId,
            page,
            limit,
        );
    }

    @ApiOperation({ summary: 'Search products by name or description' })
    @Get('search')
    @ApiQuery({ name: 'q', required: true, type: String, example: 'diamond' })
    @ApiQuery({ name: 'category', required: false, enum: JewelryCategory })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        enum: ['endDate', 'price'],
        example: 'endDate',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiResponse({
        status: 200,
        description: 'Search results fetched successfully',
    })
    async searchProducts(
        @Query('q') searchTerm: string,
        @Query('category') category?: JewelryCategory,
        @Query('sortBy') sortBy: 'endDate' | 'price' = 'endDate',
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
    ) {
        return await this.productsService.searchProducts(
            searchTerm,
            category,
            sortBy,
            page,
            limit,
        );
    }

    @ApiOperation({
        summary: 'Get product details with related products and Q&A',
    })
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Product details fetched successfully',
    })
    async getProductDetails(@Param('id') id: string) {
        return await this.productsService.getProductDetails(id);
    }

    @ApiOperation({ summary: 'Get bid history for a product' })
    @Get(':id/bids')
    @ApiResponse({
        status: 200,
        description: 'Bid history fetched successfully',
    })
    async getBidHistory(@Param('id') id: string) {
        return await this.productsService.getBidHistory(id);
    }

    @ApiOperation({ summary: 'Check if current user is rejected from bidding' })
    @ApiBearerAuth('access-token')
    @Get(':id/check-rejection')
    @UseGuards(ATAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Rejection status checked successfully',
    })
    async checkRejection(@Param('id') id: string, @Request() req: any) {
        const isRejected = await this.productsService.checkRejection(
            id,
            req.user.id,
        );
        return { isRejected };
    }

    @ApiOperation({ summary: 'Create a new product [SELLER]' })
    @ApiBearerAuth('access-token')
    @Post()
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'mainImage', maxCount: 1 },
            { name: 'additionalImages', maxCount: 5 },
        ]),
    )
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({
        status: 201,
        description: 'Product created successfully',
    })
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles()
        files: {
            mainImage?: Express.Multer.File[];
            additionalImages?: Express.Multer.File[];
        },
        @Request() req: any,
    ) {
        if (files?.mainImage?.[0]) {
            const mainImageUrl = await this.imageKitService.uploadImage(
                files.mainImage[0],
                'products',
            );
            createProductDto.mainImage = mainImageUrl;
        }

        if (files?.additionalImages) {
            const additionalImageUrls = await Promise.all(
                files.additionalImages.map((file) =>
                    this.imageKitService.uploadImage(file, 'products'),
                ),
            );
            createProductDto.additionalImages = additionalImageUrls;
        }

        return await this.productsService.createProduct(
            createProductDto,
            req.user.id,
        );
    }

    @ApiOperation({ summary: 'Place a bid on a product [BIDDER]' })
    @ApiBearerAuth('access-token')
    @Post(':id/bid')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiBody({ type: PlaceBidDto })
    @ApiResponse({
        status: 200,
        description: 'Bid placed successfully',
    })
    async placeBid(
        @Param('id') id: string,
        @Body() placeBidDto: PlaceBidDto,
        @Request() req: any,
    ) {
        return await this.productsService.placeBid(
            id,
            req.user.id,
            placeBidDto,
        );
    }

    @ApiOperation({ summary: 'Buy product immediately [BIDDER]' })
    @ApiBearerAuth('access-token')
    @Post(':id/buy-now')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER)
    @ApiResponse({
        status: 200,
        description: 'Product purchased successfully',
    })
    async buyNow(@Param('id') id: string, @Request() req: any) {
        return await this.productsService.buyNow(id, req.user.id);
    }

    @ApiOperation({ summary: 'Add product to watchlist [BIDDER]' })
    @ApiBearerAuth('access-token')
    @Post('watchlist')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiBody({ type: AddToWatchlistDto })
    @ApiResponse({
        status: 200,
        description: 'Product added to watchlist',
    })
    async addToWatchlist(
        @Body() addToWatchlistDto: AddToWatchlistDto,
        @Request() req: any,
    ) {
        return await this.productsService.addToWatchlist(
            req.user.id,
            addToWatchlistDto.productId,
        );
    }

    @ApiOperation({ summary: 'Remove product from watchlist [BIDDER]' })
    @ApiBearerAuth('access-token')
    @Delete('watchlist/:id')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Product removed from watchlist',
    })
    async removeFromWatchlist(@Param('id') id: string, @Request() req: any) {
        return await this.productsService.removeFromWatchlist(req.user.id, id);
    }

    @ApiOperation({ summary: 'Get user watchlist [BIDDER]' })
    @ApiBearerAuth('access-token')
    @Get('user/watchlist')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Watchlist fetched successfully',
    })
    async getWatchlist(@Request() req: any) {
        return await this.productsService.getWatchlist(req.user.id);
    }

    @ApiOperation({
        summary: 'Get products user is currently bidding on [BIDDER]',
    })
    @ApiBearerAuth('access-token')
    @Get('user/bidding')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Products user is bidding on fetched successfully',
    })
    async getProductsUserIsBidding(@Request() req: any) {
        return await this.productsService.getProductsUserIsBidding(req.user.id);
    }

    @ApiOperation({ summary: 'Get products user has won [BIDDER]' })
    @ApiBearerAuth('access-token')
    @Get('user/won')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Products user won fetched successfully',
    })
    async getProductsUserWon(@Request() req: any) {
        return await this.productsService.getProductsUserWon(req.user.id);
    }

    @ApiOperation({ summary: 'Ask a question about a product [BIDDER]' })
    @ApiBearerAuth('access-token')
    @Post('questions')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiBody({ type: AskQuestionDto })
    @ApiResponse({
        status: 200,
        description: 'Question submitted successfully',
    })
    async askQuestion(
        @Body() askQuestionDto: AskQuestionDto,
        @Request() req: any,
    ) {
        return await this.productsService.askQuestion(
            askQuestionDto,
            req.user.id,
        );
    }

    @ApiOperation({ summary: 'Answer a question about a product [SELLER]' })
    @ApiBearerAuth('access-token')
    @Patch('questions/:id/answer')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiBody({ type: AnswerQuestionDto })
    @ApiResponse({
        status: 200,
        description: 'Answer submitted successfully',
    })
    async answerQuestion(
        @Param('id') id: string,
        @Body() answerDto: AnswerQuestionDto,
        @Request() req: any,
    ) {
        return await this.productsService.answerQuestion(
            id,
            answerDto,
            req.user.id,
        );
    }

    @ApiOperation({ summary: 'Append description to product [SELLER]' })
    @ApiBearerAuth('access-token')
    @Patch(':id/description')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiBody({ type: UpdateProductDto })
    @ApiResponse({
        status: 200,
        description: 'Product description updated successfully',
    })
    async appendDescription(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Request() req: any,
    ) {
        return await this.productsService.appendDescription(
            id,
            updateProductDto.additionalDescription,
            req.user.id,
        );
    }

    @ApiOperation({ summary: 'Reject a bidder from product [SELLER]' })
    @ApiBearerAuth('access-token')
    @Post(':productId/reject/:bidderId')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Bidder rejected successfully',
    })
    async rejectBidder(
        @Param('productId') productId: string,
        @Param('bidderId') bidderId: string,
        @Request() req: any,
    ) {
        return await this.productsService.rejectBidder(
            productId,
            bidderId,
            req.user.id,
        );
    }

    @ApiOperation({ summary: 'Get seller products [SELLER]' })
    @ApiBearerAuth('access-token')
    @Get('seller/active')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Seller products fetched successfully',
    })
    async getSellerProducts(@Request() req: any) {
        return await this.productsService.getSellerProducts(req.user.id);
    }

    @ApiOperation({ summary: 'Get seller completed products [SELLER]' })
    @ApiBearerAuth('access-token')
    @Get('seller/completed')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Seller completed products fetched successfully',
    })
    async getSellerCompletedProducts(@Request() req: any) {
        return await this.productsService.getSellerCompletedProducts(
            req.user.id,
        );
    }

    @ApiOperation({ summary: 'Delete a product [SELLER/ADMIN]' })
    @ApiBearerAuth('access-token')
    @Delete(':id')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER, Role.ADMIN)
    @ApiResponse({
        status: 200,
        description: 'Product deleted successfully',
    })
    async deleteProduct(@Param('id') id: string, @Request() req: any) {
        return await this.productsService.deleteProduct(
            id,
            req.user.id,
            req.user.role,
        );
    }
}
