import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(data: Partial<Category>): Promise<Category> {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/d/g, 'd').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }
    const newCategory = new this.categoryModel(data);
    return newCategory.save();
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const updated = await this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm th?y danh m?c');
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Không tìm th?y danh m?c');
    return { success: true };
  }
}
