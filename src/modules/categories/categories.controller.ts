import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.categoriesService.findAll(search, pageNum, limitNum);
  }

  @Post()
  async create(@Body() body: Partial<Category>) {
    return this.categoriesService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Category>) {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
