const fs = require('fs');
const mongoose = require('mongoose');

async function test() {
  const envContent = fs.readFileSync('.env', 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });

  const uri = env.MONGODB_URI;
  await mongoose.connect(uri);

  const ArticleSchema = new mongoose.Schema({
    slug: String,
    content: String,
    title: String,
  });
  const ArticleModel = mongoose.model('Article', ArticleSchema, 'articles');

  const ProductSchema = new mongoose.Schema({
    slug: String,
    name: String,
    description: String,
  });
  const ProductModel = mongoose.model('Product', ProductSchema, 'products');

  // Search article
  const art = await ArticleModel.findOne({ slug: 'may-xoi-dat-ngoi-lai-nao-lam-duoc-ca-ruong-kho-lan-ruong-nuoc' }).exec();
  if (art) {
    console.log(`--- ARTICLE CONTENT FOR "${art.title}" ---`);
    console.log(art.content);
  }

  // Find product containing Zengteng
  const prod = await ProductModel.findOne({ slug: /zengteng/i }).exec();
  if (prod) {
    console.log(`--- PRODUCT DESCRIPTION FOR "${prod.name}" ---`);
    console.log(prod.description);
  }

  await mongoose.connection.close();
}

test().catch(console.error);
