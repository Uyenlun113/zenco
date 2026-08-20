import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

export class BannerItem {
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
  buttonText?: string;
}

@Schema({ timestamps: true })
export class Setting {
  @Prop({ default: 'honghanh_global_settings', unique: true })
  key: string;

  // Branding & Contact
  @Prop({ default: 'Tuấn Anh Machines - Máy Móc Nông Nghiệp & Công Nghiệp' })
  companyName: string;

  @Prop({ default: '0868.214.886' })
  hotline: string;

  @Prop({ default: '0868.214.886' })
  zalo: string;

  @Prop({ default: 'contact@tuananhmachine.vn' })
  email: string;

  @Prop({ default: 'Cụm CN Từ Liêm, P. Phương Canh, Q. Nam Từ Liêm, Hà Nội' })
  address: string;

  @Prop({ type: [String], default: ['Cụm CN Từ Liêm, P. Phương Canh, Q. Nam Từ Liêm, Hà Nội'] })
  addresses: string[];

  @Prop({ default: '0101234567' })
  taxCode: string;

  @Prop({ default: '/images/logo.png' })
  logoUrl: string;

  @Prop({ default: '/icon.svg' })
  faviconUrl: string;

  // Bank Info
  @Prop({ default: 'VIETINBANK' })
  bankName: string;

  @Prop({ default: '108869294069' })
  bankAccountNo: string;

  @Prop({ default: 'NGUYEN TUAN ANH' })
  bankAccountHolder: string;

  // Banners & Hero Section
  @Prop({ type: Array, default: [] })
  banners: BannerItem[];

  @Prop({ default: 'Chuyên Cung Cấp Máy Móc Công Nghiệp & Đóng Gói Tự Động Hàng Đầu' })
  heroSlogan: string;

  @Prop({ default: '' })
  promoVideoUrl: string;

  // Social Channels
  @Prop({ default: 'https://facebook.com' })
  facebookUrl: string;

  @Prop({ default: 'https://zalo.me/0868214886' })
  zaloUrl: string;

  @Prop({ default: 'https://youtube.com' })
  youtubeUrl: string;

  @Prop({ default: 'https://maps.google.com' })
  googleMapsUrl: string;

  // Global SEO
  @Prop({ default: 'Máy Móc Công Nghiệp Tuấn Anh - Giá Tốt Chính Hãng' })
  metaTitle: string;

  @Prop({ default: 'Đơn vị nhập khẩu và phân phối máy móc đóng gói, máy chế biến nông sản, máy móc công nghiệp chất lượng cao.' })
  metaDescription: string;

  @Prop({ default: '/images/og-share.jpg' })
  ogImageUrl: string;

  @Prop({ default: '' })
  googleAnalyticsId: string;

  // Footer & Policy
  @Prop({ default: 'Thứ 2 - Chủ Nhật (7:30 - 20:00)' })
  workingHours: string;

  @Prop({ default: '© 2026 Tuấn Anh Machines. Tất cả quyền được bảo lưu.' })
  copyrightText: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
