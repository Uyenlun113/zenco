import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ default: '' })
  summary: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: '' })
  thumbnail: string;

  @Prop({ default: 'Tin t?c' })
  category: string;

  @Prop({ default: true })
  published: boolean;

  @Prop({ default: 0 })
  views: number;

  // SEO Fields
  @Prop({ default: '' })
  metaTitle: string;

  @Prop({ default: '' })
  metaDescription: string;

  @Prop({ type: [String], default: [] })
  metaKeywords: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
