import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { Request } from 'express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadFile(@UploadedFile() file: any, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp hình ảnh để tải lên!');
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    // 1. Try Cloudinary Signed/Unsigned Upload if credentials exist
    if (cloudName) {
      try {
        const formData = new FormData();
        const mimeType = file.mimetype || 'image/jpeg';
        const fileBlob = new Blob([file.buffer], { type: mimeType });
        formData.append('file', fileBlob, file.originalname || 'upload.jpg');

        if (apiKey && apiSecret) {
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const folder = 'honghanhmachines';
          const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
          const signature = crypto.createHash('sha1').update(toSign).digest('hex');

          formData.append('api_key', apiKey);
          formData.append('timestamp', timestamp);
          formData.append('folder', folder);
          formData.append('signature', signature);
        } else if (uploadPreset) {
          formData.append('upload_preset', uploadPreset);
          formData.append('folder', 'honghanhmachines');
        }

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            url: data.secure_url || data.url,
            public_id: data.public_id,
            format: data.format,
            width: data.width,
            height: data.height,
          };
        } else {
          const errText = await response.text();
          console.warn('Cloudinary API error status:', response.status, errText);
        }
      } catch (err) {
        console.warn('Cloudinary upload error:', err);
      }
    }

    // 2. Local Disk Fallback: Save file to public/uploads directory
    try {
      const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const ext = path.extname(file.originalname || '') || '.jpg';
      const uniqueFilename = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;
      const filePath = path.join(publicUploadsDir, uniqueFilename);

      fs.writeFileSync(filePath, file.buffer);

      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.get('host') || 'localhost:3002';
      const localUrl = `${protocol}://${host}/uploads/${uniqueFilename}`;

      return {
        success: true,
        url: localUrl,
        filename: uniqueFilename,
        size: file.size,
      };
    } catch (err) {
      console.error('Local file save failed:', err);
      throw new BadRequestException('Không thể lưu file tải lên!');
    }
  }
}
