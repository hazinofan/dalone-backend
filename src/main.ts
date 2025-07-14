// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = [
    'http://localhost:3000',               // your dev URL
    'https://dalone.netlify.app',          // your Netlify front-end
    'https://dalone-backend.onrender.com', // if you ever call it from itself
  ];
  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,  // if you send cookies or auth headers
  });

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
