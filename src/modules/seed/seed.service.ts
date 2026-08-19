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
  ) { }

  async onModuleInit() {
    await this.seedData();
  }

  async seedData() {
    const categoriesCount = await this.categoryModel.countDocuments();
    if (categoriesCount === 0) {
      const categories = [
        { name: 'M�y x?i d?t & L�m d?t', slug: 'may-xoi-dat-lam-dat', icon: '??', description: 'C�c lo?i m�y x?i d?t da nang, m�y phay d?t, m�y c�y mini' },
        { name: 'M�y bam c? & Chan nu�i', slug: 'may-bam-co-chan-nuoi', icon: '??', description: 'M�y bam c? chu?i, m�y xay th?c an gia s�c gia c?m' },
        { name: 'M�y phun thu?c & B?o v? th?c v?t', slug: 'may-phun-thuoc-bvtv', icon: '??', description: 'M�y phun thu?c tr? s�u kh�i, m�y phun xa c�ng nghi?p' },
        { name: 'M�y c�y & Co kh� n�ng nghi?p', slug: 'may-cay-co-khi-nong-nghiep', icon: '??', description: 'M�y c�y 2 c?u, m�y ch? c?i th?y l?c, m�y bam g?' },
      ];
      await this.categoryModel.insertMany(categories);
      console.log('[SEED] Seeded categories');
    }

    const productsCount = await this.productModel.countDocuments();
    if (productsCount === 0) {
      const products = [
        {
          name: 'M�y X?i �?t �a Nang Honda F500 Engine 6.5HP',
          slug: 'may-xoi-dat-da-nang-honda-f500',
          category: 'may-xoi-dat-lam-dat',
          price: 14500000,
          discountPrice: 13200000,
          isContactPrice: false,
          images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: '�?ng co', value: 'Honda GX200 4 th�' },
            { key: 'C�ng su?t', value: '6.5 HP (Ng?a)' },
            { key: '�? s�u x?i', value: '15 - 30 cm' },
            { key: 'Chi?u r?ng x?i', value: '80 - 100 cm' },
            { key: 'Tr?ng lu?ng', value: '72 kg' },
            { key: 'Xu?t x?', value: 'Ch�nh h�ng Nh?t B?n / L?p r�p VN' },
          ],
          description: 'M�y x?i d?t Honda F500 chuy�n d?ng x?i d?t ru?ng kh�, l�m lu?ng rau, l�m c? vu?n c�y an tr�i v?i d? b?n cao v� ti?t ki?m nhi�n li?u.',
          features: ['�?ng co Honda GX200 si�u b?n', 'B�nh xe di chuy?n linh ho?t', 'H? th?ng dao x?i th�p r�n ch?u l?c'],
          inStock: true,
          isFeatured: true,
          metaTitle: 'M�y X?i �?t �a Nang Honda F500 6.5HP Ch�nh H�ng - Gi� R?',
          metaDescription: 'Mua ngay M�y x?i d?t da nang Honda F500 c�ng su?t 6.5HP gi� t?t nh?t. �?ng co si�u kh?e, b?o h�nh 12 th�ng, giao h�ng to�n qu?c.',
          metaKeywords: ['m�y x?i d?t', 'honda f500', 'm�y l�m d?t n�ng nghi?p'],
        },
        {
          name: 'M�y Bam C? B�nh X�ch �a Nang C�ng Nghi?p BC-3000',
          slug: 'may-bam-co-banh-xich-bc-3000',
          category: 'may-bam-co-chan-nuoi',
          price: 28500000,
          discountPrice: 26000000,
          isContactPrice: false,
          images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: '�?ng co', value: '�?u n? Diesel 15HP / �i?n 380V' },
            { key: 'Nang su?t', value: '3 - 5 T?n / Gi?' },
            { key: 'H? th?ng di chuy?n', value: 'B�nh x�ch cao su di?u khi?n t? xa' },
            { key: 'K�ch thu?c th�nh ph?m', value: '1 - 3 cm' },
            { key: 'Tr?ng lu?ng', value: '320 kg' },
          ],
          description: 'M�y bam c? b�nh x�ch c�ng nghi?p BC-3000 chuy�n bam c? voi, th�n c�y ng�, rom r? s? lu?ng l?n cho trang tr?i b�, d�, huou.',
          features: ['Bam nhuy?n c? tuoi v� kh�', 'Khung g?m th�p d?y 8mm ch?u l?c', 'B�nh x�ch vu?t d?a h�nh d?c d?i'],
          inStock: true,
          isFeatured: true,
          metaTitle: 'M�y Bam C? B�nh X�ch BC-3000 C�ng Nghi?p Nang Su?t Cao',
          metaDescription: 'M�y bam c? c�ng nghi?p BC-3000 ch?y b�nh x�ch nang su?t 5 t?n/gi?. Gi?i ph�p t?i uu cho trang tr?i chan nu�i b� th?t v� b� s?a.',
          metaKeywords: ['m�y bam c?', 'bc-3000', 'm�y bam c? b�nh x�ch'],
        },
        {
          name: 'M�y Phun Thu?c Tr? S�u D?ng Kh�i Pona H200',
          slug: 'may-phun-thuoc-dang-khoi-pona-h200',
          category: 'may-phun-thuoc-bvtv',
          price: 4800000,
          discountPrice: 4200000,
          isContactPrice: false,
          images: ['https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Dung t�ch b�nh ch?a', value: '16 L�t' },
            { key: 'Nhi�n li?u', value: 'Xang A92/A95' },
            { key: 'M?c ti�u hao', value: '1.2 L�t/gi?' },
            { key: 'B�n k�nh phun kh�i', value: '20 - 30 m�t' },
            { key: 'Tr?ng lu?ng kh�', value: '9.5 kg' },
          ],
          description: 'M�y phun kh�i di?t c�n tr�ng Pona H200 gi�p d?p d?ch s�u b?nh di?n r?ng c?c nhanh, th?m th?u t�n c�y an qu? d?c n�i cao.',
          features: ['T?o h?t kh�i m?n b�m d�nh cao', 'Ti?t ki?m 80% thu?c BVTV', 'Thao t�c kh?i d?ng 1 ch?m'],
          inStock: true,
          isFeatured: true,
          metaTitle: 'M�y Phun Thu?c D?ng Kh�i Pona H200 Gi� R? Ch�nh H�ng',
          metaDescription: 'Ph�n ph?i M�y phun thu?c tr? s�u d?ng kh�i Pona H200. Ti?t ki?m thu?c, phun xa 30m, b?o h�nh uTuấn Anh Tuan Anh Machines.',
          metaKeywords: ['m�y phun kh�i', 'pona h200', 'm�y phun thu?c tr? s�u'],
        },
        {
          name: 'M�y C�y 2 C?u Mini Kubota B2440 24HP',
          slug: 'may-cay-mini-kubota-b2440-24hp',
          category: 'may-cay-co-khi-nong-nghiep',
          price: 175000000,
          discountPrice: 0,
          isContactPrice: true,
          images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: '�?ng co', value: 'Kubota 3 Xi-lanh Diesel' },
            { key: 'C�ng su?t', value: '24 M� l?c (HP)' },
            { key: 'H? th?ng truy?n d?ng', value: '2 C?u (4WD)' },
            { key: 'S?c n�ng m�c sau', value: '750 kg' },
            { key: 'Xu?t x?', value: 'Kubota Nh?t B?n' },
          ],
          description: 'My cy Kubota B2440 mini chuyn d?ng cho ru?ng nh?, ru?ng b?c thang v trang tr?i cy cng nghi?p an qu?.',
          features: ['D?n d?ng 4 bnh siu linh ho?t', 'Tiu hao nhin li?u th?p', 'H? th?ng th?y l?c tr? l?c li'],
          inStock: true,
          isFeatured: true,
          metaTitle: 'My Cy Mini Kubota B2440 24HP 2 C?u - Nh?n Bo Gi',
          metaDescription: 'Bo gi my cy mini Kubota B2440 cng su?t 24HP 2 c?u. Nh?p kh?u Nh?t B?n, thch h?p m?i d?a hnh d?i ni ru?ng bi.',
          metaKeywords: ['my cy mini', 'kubota b2440', 'my cy 2 c?u'],
        }
      ];
      await this.productModel.insertMany(products);
      console.log('[SEED] Seeded agricultural products');
    }
  }
}
