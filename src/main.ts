// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const port = parseInt(process.env.PORT || '3001', 10);
  // bind to all interfaces so Render can see it
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Listening on 0.0.0.0:${port}`);
}
bootstrap();
