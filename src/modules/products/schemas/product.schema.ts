import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  discountPrice: number;

  @Prop({ default: false })
  isContactPrice: boolean;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [{ key: String, value: String }], default: [] })
  specifications: { key: string; value: string }[];

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: true })
  inStock: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: '' })
  videoUrl: string;

  // SEO Fields
  @Prop({ default: '' })
  metaTitle: string;

  @Prop({ default: '' })
  metaDescription: string;

  @Prop({ type: [String], default: [] })
  metaKeywords: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
