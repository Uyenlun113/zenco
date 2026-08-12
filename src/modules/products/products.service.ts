import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async findAll(category?: string, featured?: boolean, search?: string): Promise<Product[]> {
    const filter: any = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.isFeatured = featured;
    if (search) {
      filter['$or'] = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    return this.productModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productModel.findOne({ slug }).exec();
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async create(data: Partial<Product>): Promise<Product> {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm thấy sản phẩm để cập nhật');
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.productModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Không tìm thấy sản phẩm để xóa');
    return { success: true };
  }
}
