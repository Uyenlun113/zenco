import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './schemas/article.schema';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(@Query('admin') admin?: string) {
    const publishedOnly = admin === 'true' ? false : true;
    return this.articlesService.findAll(publishedOnly);
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
}
