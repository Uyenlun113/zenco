import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './schemas/inquiry.schema';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.inquiriesService.findAll(search, status, pageNum, limitNum);
  }

  @Post()
  async create(@Body() body: Partial<Inquiry>) {
    return this.inquiriesService.create(body);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.inquiriesService.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.inquiriesService.remove(id);
  }
}
