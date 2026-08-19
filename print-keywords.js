const fs = require('fs');
const mongoose = require('mongoose');

async function test() {
  // Read DB URI from .env
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
    title: String,
    metaKeywords: [String],
  });
  const ArticleModel = mongoose.model('Article', ArticleSchema, 'articles');

  const articles = await ArticleModel.find({}, { title: 1, metaKeywords: 1 }).exec();
  console.log(`Total articles: ${articles.length}`);
  
  for (let i = 0; i < Math.min(15, articles.length); i++) {
    console.log(`[${i + 1}] Title: ${articles[i].title}`);
    console.log(`    Keywords:`, articles[i].metaKeywords);
  }

  await mongoose.connection.close();
}

test().catch(console.error);
