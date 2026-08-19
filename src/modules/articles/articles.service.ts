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

  async getAllComments() {
    const articles = await this.articleModel
      .find({ 'comments.0': { $exists: true } }, { title: 1, slug: 1, thumbnail: 1, comments: 1 })
      .exec();

    const allComments: any[] = [];
    for (const art of articles) {
      if (Array.isArray(art.comments)) {
        for (const c of art.comments) {
          allComments.push({
            ...c,
            articleId: art._id,
            articleTitle: art.title,
            articleSlug: art.slug,
            articleThumbnail: art.thumbnail,
          });
        }
      }
    }

    allComments.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return allComments;
  }

  async addComment(slugOrId: string, commentData: any) {
    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] } : { slug: slugOrId };

    const article = await this.articleModel.findOne(filter).exec();
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');

    const newComment = {
      _id: new Date().getTime().toString(),
      author: commentData.author || commentData.name || 'Khách hàng',
      phone: commentData.phone || '',
      content: commentData.content || commentData.comment || '',
      date: commentData.date || new Date().toLocaleDateString('vi-VN'),
      answer: null,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(article.comments)) {
      article.comments = [];
    }

    article.comments.unshift(newComment);
    article.markModified('comments');
    await article.save();

    return {
      success: true,
      message: 'Bình luận đã được gửi thành công',
      comment: newComment,
      comments: article.comments,
    };
  }

  async replyComment(slugOrId: string, commentId: string, replyData: any) {
    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] } : { slug: slugOrId };

    const article = await this.articleModel.findOne(filter).exec();
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');

    if (!Array.isArray(article.comments)) {
      article.comments = [];
    }

    const commentIndex = article.comments.findIndex(
      (c: any) => String(c._id) === String(commentId) || String(c.id) === String(commentId)
    );

    if (commentIndex === -1) {
      throw new NotFoundException('Không tìm thấy bình luận để trả lời');
    }

    article.comments[commentIndex].answer = {
      author: replyData.author || 'Kỹ Thuật Viên Tuấn Anh Machines',
      content: replyData.content || '',
      date: replyData.date || new Date().toLocaleDateString('vi-VN'),
      answeredAt: new Date().toISOString(),
    };

    article.markModified('comments');
    await article.save();

    return {
      success: true,
      message: 'Đã lưu phản hồi bình luận',
      comment: article.comments[commentIndex],
      comments: article.comments,
    };
  }

  async deleteComment(slugOrId: string, commentId: string) {
    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] } : { slug: slugOrId };

    const article = await this.articleModel.findOne(filter).exec();
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');

    if (Array.isArray(article.comments)) {
      article.comments = article.comments.filter(
        (c: any) => String(c._id) !== String(commentId) && String(c.id) !== String(commentId)
      );
      article.markModified('comments');
      await article.save();
    }

    return { success: true, message: 'Đã xóa bình luận', comments: article.comments };
  }
}