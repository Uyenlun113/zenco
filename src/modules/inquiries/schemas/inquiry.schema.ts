import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InquiryDocument = Inquiry & Document;

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  productName: string;

  @Prop({ default: '' })
  message: string;

  @Prop({ default: 'NEW' }) // NEW, CONTACTED, COMPLETED
  status: string;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
