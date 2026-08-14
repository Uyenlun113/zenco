import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from './schemas/inquiry.schema';

@Injectable()
export class InquiriesService {
  constructor(@InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>) {}

  async findAll(
    search?: string,
    status?: string,
    page?: number,
    limit?: number,
  ) {
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter['$or'] = [
        { customerName: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { productName: new RegExp(search, 'i') },
        { message: new RegExp(search, 'i') },
      ];
    }

    if (page && limit) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const skip = (pageNum - 1) * limitNum;
      const [items, total] = await Promise.all([
        this.inquiryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).exec(),
        this.inquiryModel.countDocuments(filter).exec(),
      ]);
      const totalPages = Math.ceil(total / limitNum) || 1;
      return { items, total, page: pageNum, totalPages, limit: limitNum };
    }

    return this.inquiryModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async create(data: Partial<Inquiry>): Promise<Inquiry> {
    const newInquiry = new this.inquiryModel(data);
    return newInquiry.save();
  }

  async updateStatus(id: string, status: string): Promise<Inquiry> {
    const updated = await this.inquiryModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm thấy yêu cầu báo giá');
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.inquiryModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Không tìm thấy yêu cầu');
    return { success: true };
  }
}