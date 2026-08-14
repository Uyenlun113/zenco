import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async findAll(
    publishedOnly = true,
    search?: string,
    page?: number,
    limit?: number,
  ) {
    const filter: any = publishedOnly ? { published: true } : {};
    if (search) {
      filter['$or'] = [
        { title: new RegExp(search, 'i') },
        { summary: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
      ];
    }

    if (page && limit) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const skip = (pageNum - 1) * limitNum;
      const [items, total] = await Promise.all([
        this.articleModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).exec(),
        this.articleModel.countDocuments(filter).exec(),
      ]);
      const totalPages = Math.ceil(total / limitNum) || 1;
      return { items, total, page: pageNum, totalPages, limit: limitNum };
    }

    return this.articleModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).exec();
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');
    return article;
  }

  async create(data: Partial<Article>): Promise<Article> {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }
    const newArticle = new this.articleModel(data);
    return newArticle.save();
  }

  async update(id: string, data: Partial<Article>): Promise<Article> {
    const updated = await this.articleModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm thấy bài viết');
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.articleModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Không tìm thấy bài viết');
    return { success: true };
  }
}