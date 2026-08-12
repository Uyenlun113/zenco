import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './schemas/inquiry.schema';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  async findAll() {
    return this.inquiriesService.findAll();
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
