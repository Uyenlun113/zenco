import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { Article, ArticleDocument } from '../articles/schemas/article.schema';
import { Inquiry, InquiryDocument } from '../inquiries/schemas/inquiry.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  async seedData() {
    const categoriesCount = await this.categoryModel.countDocuments();
    if (categoriesCount === 0) {
      const categories = [
        { name: 'Máy x?i d?t & Làm d?t', slug: 'may-xoi-dat-lam-dat', icon: '??', description: 'Các lo?i máy x?i d?t da nang, máy phay d?t, máy cày mini' },
        { name: 'Máy bam c? & Chan nuôi', slug: 'may-bam-co-chan-nuoi', icon: '??', description: 'Máy bam c? chu?i, máy xay th?c an gia súc gia c?m' },
        { name: 'Máy phun thu?c & B?o v? th?c v?t', slug: 'may-phun-thuoc-bvtv', icon: '??', description: 'Máy phun thu?c tr? sâu khói, máy phun xa công nghi?p' },
        { name: 'Máy cày & Co khí nông nghi?p', slug: 'may-cay-co-khi-nong-nghiep', icon: '??', description: 'Máy cày 2 c?u, máy ch? c?i th?y l?c, máy bam g?' },
      ];
      await this.categoryModel.insertMany(categories);
      console.log('[SEED] Seeded categories');
    }

    const productsCount = await this.productModel.countDocuments();
    if (productsCount === 0) {
      const products = [
        {
          name: 'Máy X?i Ð?t Ða Nang Honda F500 Engine 6.5HP',
          slug: 'may-xoi-dat-da-nang-honda-f500',
          category: 'may-xoi-dat-lam-dat',
          price: 14500000,
          discountPrice: 13200000,
          isContactPrice: false,
          images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Ð?ng co', value: 'Honda GX200 4 thì' },
            { key: 'Công su?t', value: '6.5 HP (Ng?a)' },
            { key: 'Ð? sâu x?i', value: '15 - 30 cm' },
            { key: 'Chi?u r?ng x?i', value: '80 - 100 cm' },
            { key: 'Tr?ng lu?ng', value: '72 kg' },
            { key: 'Xu?t x?', value: 'Chính hãng Nh?t B?n / L?p ráp VN' },
          ],
          description: 'Máy x?i d?t Honda F500 chuyên d?ng x?i d?t ru?ng khô, làm lu?ng rau, làm c? vu?n cây an trái v?i d? b?n cao và ti?t ki?m nhiên li?u.',
          features: ['Ð?ng co Honda GX200 siêu b?n', 'Bánh xe di chuy?n linh ho?t', 'H? th?ng dao x?i thép rèn ch?u l?c'],
          inStock: true,
          isFeatured: true,
          metaTitle: 'Máy X?i Ð?t Ða Nang Honda F500 6.5HP Chính Hãng - Giá R?',
          metaDescription: 'Mua ngay Máy x?i d?t da nang Honda F500 công su?t 6.5HP giá t?t nh?t. Ð?ng co siêu kh?e, b?o hành 12 tháng, giao hàng toàn qu?c.',
          metaKeywords: ['máy x?i d?t', 'honda f500', 'máy làm d?t nông nghi?p'],
        },
        {
          name: 'Máy Bam C? Bánh Xích Ða Nang Công Nghi?p BC-3000',
          slug: 'may-bam-co-banh-xich-bc-3000',
          category: 'may-bam-co-chan-nuoi',
          price: 28500000,
          discountPrice: 26000000,
          isContactPrice: false,
          images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Ð?ng co', value: 'Ð?u n? Diesel 15HP / Ði?n 380V' },
            { key: 'Nang su?t', value: '3 - 5 T?n / Gi?' },
            { key: 'H? th?ng di chuy?n', value: 'Bánh xích cao su di?u khi?n t? xa' },
            { key: 'Kích thu?c thành ph?m', value: '1 - 3 cm' },
            { key: 'Tr?ng lu?ng', value: '320 kg' },
          ],
          description: 'Máy bam c? bánh xích công nghi?p BC-3000 chuyên bam c? voi, thân cây ngô, rom r? s? lu?ng l?n cho trang tr?i bò, dê, huou.',
          features: ['Bam nhuy?n c? tuoi và khô', 'Khung g?m thép d?y 8mm ch?u l?c', 'Bánh xích vu?t d?a hình d?c d?i'],
          inStock: true,
          isFeatured: true,
          metaTitle: 'Máy Bam C? Bánh Xích BC-3000 Công Nghi?p Nang Su?t Cao',
          metaDescription: 'Máy bam c? công nghi?p BC-3000 ch?y bánh xích nang su?t 5 t?n/gi?. Gi?i pháp t?i uu cho trang tr?i chan nuôi bò th?t và bò s?a.',
          metaKeywords: ['máy bam c?', 'bc-3000', 'máy bam c? bánh xích'],
        },
        {
          name: 'Máy Phun Thu?c Tr? Sâu D?ng Khói Pona H200',
          slug: 'may-phun-thuoc-dang-khoi-pona-h200',
          category: 'may-phun-thuoc-bvtv',
          price: 4800000,
          discountPrice: 4200000,
          isContactPrice: false,
          images: ['https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Dung tích bình ch?a', value: '16 Lít' },
            { key: 'Nhiên li?u', value: 'Xang A92/A95' },
            { key: 'M?c tiêu hao', value: '1.2 Lít/gi?' },
            { key: 'Bán kính phun khói', value: '20 - 30 mét' },
            { key: 'Tr?ng lu?ng khô', value: '9.5 kg' },
          ],
          description: 'Máy phun khói di?t côn trùng Pona H200 giúp d?p d?ch sâu b?nh di?n r?ng c?c nhanh, th?m th?u tán cây an qu? d?c núi cao.',
          features: ['T?o h?t khói m?n bám dính cao', 'Ti?t ki?m 80% thu?c BVTV', 'Thao tác kh?i d?ng 1 ch?m'],
          inStock: true,
          isFeatured: true,
          metaTitle: 'Máy Phun Thu?c D?ng Khói Pona H200 Giá R? Chính Hãng',
          metaDescription: 'Phân ph?i Máy phun thu?c tr? sâu d?ng khói Pona H200. Ti?t ki?m thu?c, phun xa 30m, b?o hành uy tín t?i Hong Hanh Machines.',
          metaKeywords: ['máy phun khói', 'pona h200', 'máy phun thu?c tr? sâu'],
        },
        {
          name: 'Máy Cày 2 C?u Mini Kubota B2440 24HP',
          slug: 'may-cay-mini-kubota-b2440-24hp',
          category: 'may-cay-co-khi-nong-nghiep',
          price: 175000000,
          discountPrice: 0,
          isContactPrice: true,
          images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Ð?ng co', value: 'Kubota 3 Xi-lanh Diesel' },
            { key: 'Công su?t', value: '24 Mã l?c (HP)' },
            { key: 'H? th?ng truy?n d?ng', value: '2 C?u (4WD)' },
            { key: 'S?c nâng móc sau', value: '750 kg' },
            { key: 'Xu?t x?', value: 'Kubota Nh?t B?n' },
          ],
          description: 'Máy cày Kubota B2440 mini chuyên d?ng cho ru?ng nh?, ru?ng b?c thang và trang tr?i cây công nghi?p an qu?.',
          features: ['D?n d?ng 4 bánh siêu linh ho?t', 'Tiêu hao nhiên li?u th?p', 'H? th?ng th?y l?c tr? l?c lái'],
          inStock: true,
          isFeatured: true,
          metaTitle: 'Máy Cày Mini Kubota B2440 24HP 2 C?u - Nh?n Báo Giá',
          metaDescription: 'Báo giá máy cày mini Kubota B2440 công su?t 24HP 2 c?u. Nh?p kh?u Nh?t B?n, thích h?p m?i d?a hình d?i núi ru?ng bãi.',
          metaKeywords: ['máy cày mini', 'kubota b2440', 'máy cày 2 c?u'],
        }
      ];
      await this.productModel.insertMany(products);
      console.log('[SEED] Seeded agricultural products');
    }

    const articlesCount = await this.articleModel.countDocuments();
    if (articlesCount === 0) {
      const articles = [
        {
          title: 'Hu?ng D?n V?n Hành & B?o Du?ng Máy X?i Ð?t An Toàn Ðúng K? Thu?t',
          slug: 'huong-dan-van-hanh-bao-duong-may-xoi-dat',
          summary: 'Nh?ng luu ý quan tr?ng v? thay d?u nh?t, ki?m tra lu?i x?i và thao tác an toàn khi s? d?ng máy x?i d?t nông nghi?p.',
          content: '<p>Máy x?i d?t là thi?t b? nông nghi?p không th? thi?u c?a bà con nông dân. Ð? máy luôn b?n b? và ti?t ki?m nhiên li?u, bà con c?n th?c hi?n ki?m tra d?u nh?t d?ng co tru?c m?i ca làm vi?c...</p>',
          thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
          category: 'Kinh nghi?m nông nghi?p',
          published: true,
          metaTitle: 'Hu?ng D?n V?n Hành Máy X?i Ð?t Ðúng K? Thu?t An Toàn',
          metaDescription: 'T?ng h?p quy trình ki?m tra và b?o du?ng máy x?i d?t da nang Honda, Kama giúp tang tu?i th? và gi?m h?ng hóc v?t.',
          metaKeywords: ['kinh nghi?m s? d?ng máy x?i d?t', 'b?o du?ng máy nông nghi?p'],
        },
        {
          title: 'Top 3 Dòng Máy Bam C? Cho Trang Tr?i Bò Th?t Hi?u Qu? Nh?t 2026',
          slug: 'top-3-dong-may-bam-co-cho-trang-trai-bo',
          summary: 'Ðánh giá chi ti?t nang su?t và uu nhu?c di?m c?a các dòng máy bam c? bánh xích, máy bam d?u n? Diesel.',
          content: '<p>Chan nuôi bò quy mô l?n dòi h?i lu?ng th?c an xanh kh?ng l? m?i ngày. Vi?c trang b? máy bam c? nang su?t cao giúp gi?i phóng s?c lao d?ng và ti?t ki?m chi phí nhân công dáng k?...</p>',
          thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
          category: 'Tu v?n thi?t b?',
          published: true,
          metaTitle: 'Top 3 Máy Bam C? Trang Tr?i Bò T?t Nh?t Hi?n Nay',
          metaDescription: 'G?i ý top 3 máy bam c? voi, bam rom r? công nghi?p nang su?t 3-5 t?n/gi? cho h? chan nuôi trang tr?i l?n.',
          metaKeywords: ['máy bam c? bò', 'máy bam c? voi', 'thi?t b? chan nuôi'],
        }
      ];
      await this.articleModel.insertMany(articles);
      console.log('[SEED] Seeded articles');
    }
  }
}
