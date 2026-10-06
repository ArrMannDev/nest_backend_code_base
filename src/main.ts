import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // for fetch requests
  app.use(helmet({
    crossOriginResourcePolicy: false, // disable default CSP blocking for images
  }));

  // Serve images with proper headers
  app.use('/images', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // <— this fixes your error
    next();
  }, express.static(join(process.cwd(), 'public/images')));

  const PORT = process.env.PORT ?? 5300;
  const HOST = process.env.HOST ?? 'localhost';

  /* Swagger Setup */
  const config = new DocumentBuilder()
    .setTitle('Blind Box Store API')
    .setDescription('The Blind Box Store API description')
    .setVersion('1.0')
    .addTag('blind-box')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, HOST);
  console.log(`NestJS App is running on http://${HOST}:${PORT}`);

  console.log(`Swagger UI is available at http://${HOST}:${PORT}/api`);
}
bootstrap();
