import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from './schemas/inquiry.schema';

@Injectable()
export class InquiriesService {
  constructor(@InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>) {}

  async findAll(): Promise<Inquiry[]> {
    return this.inquiryModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(data: Partial<Inquiry>): Promise<Inquiry> {
    const newInquiry = new this.inquiryModel(data);
    return newInquiry.save();
  }

  async updateStatus(id: string, status: string): Promise<Inquiry> {
    const updated = await this.inquiryModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm th?y yêu c?u báo giá');
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.inquiryModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Không tìm th?y yêu c?u');
    return { success: true };
  }
}
