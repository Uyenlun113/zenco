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

export class MilestoneItem {
  year: string;
  title: string;
  desc: string;
}

export class FaqItem {
  id?: string;
  question: string;
  answer: string;
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

  // About Us / Giới Thiệu Section
  @Prop({ default: 'Về Điện Máy Tuấn Anh' })
  aboutSubtitle: string;

  @Prop({ default: 'Giải Pháp Cơ Giới Hóa Nâng Tầm Nông Nghiệp Việt' })
  aboutTitle: string;

  @Prop({ default: 'Khởi nguồn từ mong muốn giải phóng sức lao động chân tay cho bà con, Tuấn Anh Machines tự hào là thương hiệu uy tín phân phối chính hãng các dòng máy xới đất, máy băm cỏ bánh xích và thiết bị công nghiệp công nghệ cao.' })
  aboutDesc1: string;

  @Prop({ default: 'Chúng tôi chuyên cung cấp sản phẩm nhập khẩu nguyên chiếc chính hãng Honda, Kubota, Pona... Mỗi sản phẩm đều được kiểm định nghiêm ngặt, cam kết đầy đủ hóa đơn chứng từ cùng chế độ bảo hành vàng 24 tháng toàn quốc.' })
  aboutDesc2: string;

  @Prop({ default: 'https://res.cloudinary.com/drjr9j8ct/image/upload/v1787112826/honghanhmachines/articles/oxsa8l4w3gcaa4bt8neu.jpg' })
  aboutImageUrl: string;

  @Prop({ default: '20+' })
  aboutStat1Val: string;

  @Prop({ default: 'Năm Uy Tín' })
  aboutStat1Label: string;

  @Prop({ default: '10,000+' })
  aboutStat2Val: string;

  @Prop({ default: 'Khách Hàng' })
  aboutStat2Label: string;

  @Prop({ default: '63' })
  aboutStat3Val: string;

  @Prop({ default: 'Tỉnh Thành' })
  aboutStat3Label: string;

  @Prop({ default: '24/7' })
  aboutStat4Val: string;

  @Prop({ default: 'Hỗ Trợ Kỹ Thuật' })
  aboutStat4Label: string;

  // Milestones (Cột mốc lịch sử)
  @Prop({ default: 'Hành trình 15 năm cùng nông nghiệp Việt' })
  aboutMilestonesTitle: string;

  @Prop({ default: 'CÁC CỘT MỐC LỊCH SỬ' })
  aboutMilestonesSubtitle: string;

  @Prop({
    type: Array,
    default: [
      { year: "2011", title: "Khởi tạo thương hiệu", desc: "Thành lập cơ sở máy nông nghiệp Tuấn Anh tại Hà Nội với các dòng máy làm đất mini." },
      { year: "2017", title: "Mở rộng kho 2.000m²", desc: "Đầu tư nhà xưởng lắp ráp & kho bãi phụ tùng chính hãng tại Cụm CN Từ Liêm." },
      { year: "2022", title: "Mốc 30.000+ máy", desc: "Phục vụ hơn 30.000 hộ nông dân & trang trại canh tác trên toàn bộ 63 tỉnh thành." },
      { year: "2026", title: "Chuyển đổi số B2B", desc: "Tiên phong tư vấn kỹ thuật trực tuyến 24/7 & hỗ trợ giao máy tận ruộng trong 24h." },
    ]
  })
  aboutMilestones: MilestoneItem[];

  // FAQs (Câu hỏi thường gặp)
  @Prop({ default: 'Câu hỏi thường gặp' })
  aboutFaqTitle: string;

  @Prop({ default: 'Giải đáp thắc mắc chi tiết về vận chuyển, hướng dẫn nổ thử máy tại nhà và bảo hành chính hãng Tuấn Anh Machines.' })
  aboutFaqSubtitle: string;

  @Prop({
    type: Array,
    default: [
      {
        id: "01",
        question: "Tôi có được thử nổ máy và phay đất thử trước khi thanh toán không?",
        answer: "Có. Kỹ thuật viên của Tuấn Anh Machines hoặc đơn vị vận chuyển sẽ bàn giao máy tận nhà, hỗ trợ đổ nhiên liệu và khởi động nổ thử máy trực tiếp. Quý khách kiểm tra máy vận hành hoàn hảo mới tiến hành thanh toán tiền.",
      },
      {
        id: "02",
        question: "Chế độ bảo hành 24 tháng áp dụng cho những bộ phận nào?",
        answer: "Chúng tôi bảo hành chính hãng 24 tháng cho toàn bộ khung gầm, hộp số và khối động cơ (Honda, Kubota). Nếu phát sinh sự cố kỹ thuật, đội ngũ kỹ sư sẽ hỗ trợ xử lý tận nhà hoặc qua video call trong 24 giờ.",
      },
      {
        id: "03",
        question: "Nếu máy bị hỏng linh kiện thì có sẵn phụ tùng thay thế không?",
        answer: "Tuấn Anh Machines sở hữu tổng kho 2.000m² luôn dự trữ sẵn 100% linh kiện phụ tùng chính hãng như: bộ dao phay đất, lưỡi băm cỏ, dây curoa, bugi, lọc gió... Quý khách được cung cấp phụ tùng giá gốc trọn đời.",
      },
      {
        id: "04",
        question: "Tôi ở vùng sâu vùng xa/miền núi thì công ty giao máy như thế nào?",
        answer: "Chúng tôi hợp tác chặt chẽ với hệ thống xe khách liên tỉnh và dịch vụ giao hàng tận nhà Viettel Post. Máy sẽ được đóng thùng gỗ an toàn và vận chuyển tận tay quý khách trong vòng 24 - 48 giờ trên toàn quốc.",
      },
      {
        id: "05",
        question: "Chính sách đổi trả trong 7 ngày đầu được quy định ra sao?",
        answer: "Trong vòng 7 ngày kể từ khi nhận máy, nếu sản phẩm phát sinh lỗi kỹ thuật từ nhà sản xuất (không phải do va đập hay vận hành sai quy cách), chúng tôi hỗ trợ đổi ngay máy mới 100% không phát sinh thêm chi phí.",
      },
    ]
  })
  aboutFaqs: FaqItem[];
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
