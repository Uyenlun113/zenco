import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useStaticAssets(join(process.cwd(), 'public'));
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Backend server running on http://localhost:${port}`);
}
bootstrap();

