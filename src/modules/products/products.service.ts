import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) { }

  async findByCategories() {
    const categories = await this.categoryModel
      .find()
      .sort({ createdAt: 1 })
      .exec();
    const result: any[] = [];
    for (const cat of categories) {
      const products = await this.productModel
        .find({ category: cat.slug })
        .sort({ createdAt: 1 })
        .limit(6)
        .exec();
      if (products.length > 0) {
        result.push({
          ...cat.toObject(),
          products,
        });
      }
    }
    return result;
  }

  async findAll(
    category?: string,
    featured?: boolean,
    isNewProduct?: boolean,
    search?: string,
    page?: number,
    limit?: number,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: string,
  ) {
    const filterConditions: any[] = [];

    if (category && category !== 'ALL') {
      const isObjectId = category.match(/^[0-9a-fA-F]{24}$/);
      const catDoc = await this.categoryModel
        .findOne(
          isObjectId
            ? { $or: [{ _id: category }, { slug: category }] }
            : { slug: category },
        )
        .exec();

      if (catDoc) {
        filterConditions.push({
          $or: [
            { category: catDoc.slug },
            { category: catDoc._id.toString() },
            { category: category },
            { categoryId: catDoc._id.toString() },
            { categoryId: catDoc.slug },
          ],
        });
      } else {
        filterConditions.push({
          $or: [{ category: category }, { categoryId: category }],
        });
      }
    }

    if (featured !== undefined) {
      filterConditions.push({ isFeatured: featured });
    }

    if (isNewProduct !== undefined) {
      filterConditions.push({ isNewProduct: isNewProduct });
    }

    if (search) {
      filterConditions.push({
        $or: [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
        ],
      });
    }

    // Price range filtering (using either discountPrice or price)
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilterObj: any = {};
      if (minPrice !== undefined) priceFilterObj.$gte = minPrice;
      if (maxPrice !== undefined) priceFilterObj.$lte = maxPrice;

      filterConditions.push({
        $or: [
          { discountPrice: { $gt: 0, ...priceFilterObj } },
          {
            $or: [
              { discountPrice: { $exists: false } },
              { discountPrice: 0 },
              { discountPrice: null },
            ],
            price: priceFilterObj,
          },
        ],
      });
    }

    const filter =
      filterConditions.length > 0 ? { $and: filterConditions } : {};

    // Sorting options
    let sortObj: any = { createdAt: -1 };
    if (sortBy === 'PRICE_ASC') {
      sortObj = { price: 1 };
    } else if (sortBy === 'PRICE_DESC') {
      sortObj = { price: -1 };
    }

    if (page && limit) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const skip = (pageNum - 1) * limitNum;
      const [items, total] = await Promise.all([
        this.productModel
          .find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .exec(),
        this.productModel.countDocuments(filter).exec(),
      ]);
      const totalPages = Math.ceil(total / limitNum) || 1;
      return { items, total, page: pageNum, totalPages, limit: limitNum };
    }

    return this.productModel.find(filter).sort(sortObj).exec();
  }

  async getAllComments() {
    const products = await this.productModel
      .find(
        { 'comments.0': { $exists: true } },
        { name: 1, slug: 1, images: 1, comments: 1 },
      )
      .sort({ updatedAt: -1 })
      .exec();

    const allComments: any[] = [];
    for (const prod of products) {
      if (Array.isArray(prod.comments)) {
        for (const c of prod.comments) {
          allComments.push({
            ...c,
            productId: (prod as any)._id,
            productName: prod.name,
            productSlug: prod.slug,
            productImage: prod.images?.[0] || '',
          });
        }
      }
    }

    allComments.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return allComments;
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
    if (!data.category) {
      data.category = (data as any).categoryId || 'may-moc-nong-nghiep';
    }
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  async update(idOrSlug: string, data: Partial<Product>): Promise<Product> {
    if (!data.category && (data as any).categoryId) {
      data.category = (data as any).categoryId;
    }
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId
      ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
      : { slug: idOrSlug };
    const updated = await this.productModel
      .findOneAndUpdate(filter, data, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException('Không tìm thấy sản phẩm để cập nhật');
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.productModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Không tìm thấy sản phẩm để xóa');
    return { success: true };
  }

  async addReview(slugOrId: string, reviewData: any) {
    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId
      ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] }
      : { slug: slugOrId };

    const product = await this.productModel.findOne(filter).exec();
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    const newReview = {
      _id: new Date().getTime().toString(),
      author: reviewData.author || reviewData.name || 'Khách hàng',
      phone: reviewData.phone || '',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || reviewData.content || '',
      date: reviewData.date || new Date().toLocaleDateString('vi-VN'),
      avatar:
        reviewData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      images: Array.isArray(reviewData.images) ? reviewData.images : [],
      verified: true,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    product.reviews.unshift(newReview);
    product.markModified('reviews');
    await product.save();

    return {
      success: true,
      message: 'Đánh giá đã được lưu thành công',
      review: newReview,
      reviews: product.reviews,
    };
  }

  async addComment(slugOrId: string, commentData: any) {
    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId
      ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] }
      : { slug: slugOrId };

    const product = await this.productModel.findOne(filter).exec();
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    const newComment = {
      _id: new Date().getTime().toString(),
      author: commentData.author || commentData.name || 'Khách hàng',
      phone: commentData.phone || '',
      content: commentData.content || commentData.comment || '',
      date: commentData.date || new Date().toLocaleDateString('vi-VN'),
      answer: null,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(product.comments)) {
      product.comments = [];
    }

    product.comments.unshift(newComment);
    product.markModified('comments');
    await product.save();

    return {
      success: true,
      message: 'Câu hỏi tư vấn đã được gửi thành công',
      comment: newComment,
      comments: product.comments,
    };
  }

  async replyComment(slugOrId: string, commentId: string, replyData: any) {
    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId
      ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] }
      : { slug: slugOrId };

    const product = await this.productModel.findOne(filter).exec();
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    if (!Array.isArray(product.comments)) {
      product.comments = [];
    }

    const commentIndex = product.comments.findIndex(
      (c: any) =>
        String(c._id) === String(commentId) ||
        String(c.id) === String(commentId),
    );

    if (commentIndex === -1) {
      throw new NotFoundException('Không tìm thấy câu hỏi để trả lời');
    }

    product.comments[commentIndex].answer = {
      author: replyData.author || 'Kỹ Thuật Viên Tuấn Anh Machines',
      content: replyData.content || '',
      date: replyData.date || new Date().toLocaleDateString('vi-VN'),
      answeredAt: new Date().toISOString(),
    };

    product.markModified('comments');
    await product.save();

    return {
      success: true,
      message: 'Đã lưu câu trả lời tư vấn kỹ thuật',
      comment: product.comments[commentIndex],
      comments: product.comments,
    };
  }

  async deleteComment(slugOrId: string, commentId: string) {
    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId
      ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] }
      : { slug: slugOrId };

    const product = await this.productModel.findOne(filter).exec();
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    if (Array.isArray(product.comments)) {
      product.comments = product.comments.filter(
        (c: any) =>
          String(c._id) !== String(commentId) &&
          String(c.id) !== String(commentId),
      );
      product.markModified('comments');
      await product.save();
    }

    return {
      success: true,
      message: 'Đã xóa câu hỏi',
      comments: product.comments,
    };
  }
}
