import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    const isFeatured = featured === 'true' ? true : featured === 'false' ? false : undefined;
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const minPriceNum = minPrice ? parseInt(minPrice, 10) : undefined;
    const maxPriceNum = maxPrice ? parseInt(maxPrice, 10) : undefined;
    return this.productsService.findAll(category, isFeatured, search, pageNum, limitNum, minPriceNum, maxPriceNum, sortBy);
  }

  @Get('by-categories')
  async findByCategories() {
    return this.productsService.findByCategories();
  }

  @Get('comments/all')
  async getAllComments() {
    return this.productsService.getAllComments();
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  async create(@Body() body: Partial<Product>) {
    return this.productsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Product>) {
    return this.productsService.update(id, body);
  }

  @Post(':slug/reviews')
  async addReview(@Param('slug') slug: string, @Body() reviewData: any) {
    return this.productsService.addReview(slug, reviewData);
  }

  @Post(':slug/comments')
  async addComment(@Param('slug') slug: string, @Body() commentData: any) {
    return this.productsService.addComment(slug, commentData);
  }

  @Post(':slug/comments/:commentId/reply')
  async replyComment(
    @Param('slug') slug: string,
    @Param('commentId') commentId: string,
    @Body() replyData: any,
  ) {
    return this.productsService.replyComment(slug, commentId, replyData);
  }

  @Delete(':slug/comments/:commentId')
  async deleteComment(
    @Param('slug') slug: string,
    @Param('commentId') commentId: string,
  ) {
    return this.productsService.deleteComment(slug, commentId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
