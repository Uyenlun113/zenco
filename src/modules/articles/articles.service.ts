import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async findAll(publishedOnly = true): Promise<Article[]> {
    const filter = publishedOnly ? { published: true } : {};
    return this.articleModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).exec();
    if (!article) throw new NotFoundException('Không tìm th?y bài vi?t');
    return article;
  }

  async create(data: Partial<Article>): Promise<Article> {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/d/g, 'd').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }
    const newArticle = new this.articleModel(data);
    return newArticle.save();
  }

  async update(id: string, data: Partial<Article>): Promise<Article> {
    const updated = await this.articleModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm th?y bài vi?t');
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.articleModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Không tìm th?y bài vi?t');
    return { success: true };
  }
}
