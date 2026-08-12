import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp hình ảnh để tải lên!');
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'honghanhmachines';
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'honghanhmachines_preset';

    try {
      // 1. Prepare Multipart Form Data for Direct Cloudinary API Upload
      const formData = new FormData();
      const mimeType = file.mimetype || 'image/jpeg';
      const fileBlob = new Blob([file.buffer], { type: mimeType });

      formData.append('file', fileBlob, file.originalname || 'upload.jpg');
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'honghanhmachines');

      // 2. Post directly to Cloudinary REST API Endpoint
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
      }
    } catch (err) {
      console.warn('Cloudinary upload fallback triggered:', err);
    }

    // 3. Fallback: Base64 Data URL (0 local storage saved, 100% in memory)
    const mimeType = file.mimetype || 'image/jpeg';
    const base64 = file.buffer.toString('base64');
    const fallbackUrl = `data:${mimeType};base64,${base64}`;

    return {
      success: true,
      url: fallbackUrl,
      filename: file.originalname,
      size: file.size,
    };
  }
}
