import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async findAll(
    search?: string,
    page?: number,
    limit?: number,
  ) {
    const filter: any = {};
    if (search) {
      filter['$or'] = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    if (page && limit) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const skip = (pageNum - 1) * limitNum;
      const [items, total] = await Promise.all([
        this.categoryModel.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limitNum).exec(),
        this.categoryModel.countDocuments(filter).exec(),
      ]);
      const totalPages = Math.ceil(total / limitNum) || 1;
      return { items, total, page: pageNum, totalPages, limit: limitNum };
    }

    return this.categoryModel.find(filter).sort({ createdAt: 1 }).exec();
  }

  async create(data: Partial<Category>): Promise<Category> {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }
    const newCategory = new this.categoryModel(data);
    return newCategory.save();
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const updated = await this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm thấy danh mục');
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Không tìm thấy danh mục');
    return { success: true };
  }
}