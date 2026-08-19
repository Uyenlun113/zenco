import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) { }

  async getSettings(): Promise<Setting> {
    let settings = await this.settingModel.findOne({
      key: 'honghanh_global_settings',
    });
    if (!settings) {
      settings = await this.settingModel.create({
        key: 'honghanh_global_settings',
        companyName: 'Công Ty TNHH Máy & Thiết Bị Tuấn Anh',
        hotline: '0988.123.456',
        zalo: '0988.123.456',
        email: 'contact@honghanhmachines.com',
        address: 'Cụm CN Từ Liêm, P. Phương Canh, Q. Nam Từ Liêm, Hà Nội',
        taxCode: '0101234567',
        heroSlogan: 'Chuyên Cung Cấp Máy Móc Công Nghiệp & Đóng Gói Tự Động Hàng Đầu',
        banners: [
          {
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
            title: 'Máy Móc Công Nghiệp Hiện Đại 2026',
            subtitle: 'Nhập khẩu trực tiếp - Bảo hành chính hãng 24 tháng',
            link: '/san-pham',
            buttonText: 'Khám Phá Ngay',
          },
        ],
      });
    }
    return settings;
  }

  async updateSettings(updateData: Partial<Setting>): Promise<Setting> {
    return this.settingModel.findOneAndUpdate(
      { key: 'honghanh_global_settings' },
      { $set: updateData },
      { new: true, upsert: true },
    );
  }
}
