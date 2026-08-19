import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './schemas/article.schema';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(
    @Query('admin') admin?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const publishedOnly = admin === 'true' ? false : true;
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.articlesService.findAll(publishedOnly, search, pageNum, limitNum);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Post()
  async create(@Body() body: Partial<Article>) {
    return this.articlesService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Article>) {
    return this.articlesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  @Get('comments/all')
  async getAllComments() {
    return this.articlesService.getAllComments();
  }

  @Post(':slug/comments')
  async addComment(@Param('slug') slug: string, @Body() commentData: any) {
    return this.articlesService.addComment(slug, commentData);
  }

  @Post(':slug/comments/:commentId/reply')
  async replyComment(
    @Param('slug') slug: string,
    @Param('commentId') commentId: string,
    @Body() replyData: any,
  ) {
    return this.articlesService.replyComment(slug, commentId, replyData);
  }

  @Delete(':slug/comments/:commentId')
  async deleteComment(
    @Param('slug') slug: string,
    @Param('commentId') commentId: string,
  ) {
    return this.articlesService.deleteComment(slug, commentId);
  }
}
