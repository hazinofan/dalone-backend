// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule }   from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = [
    'http://localhost:3000',
    'https://dalone.netlify.app',
    'https://dalone-backend.onrender.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // allow non-browser (no origin) requests
      if (!origin) return callback(null, true);

      // strip trailing slashes
      const incoming = origin.replace(/\/+$/, '');

      // find the matching whitelist entry
      const match = whitelist.find(u => u === incoming);
      if (match) {
        // return the normalized, slash-free URL
        return callback(null, match);
      }

      return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  console.log(`🚀 Server running on port ${process.env.PORT || 3001}`);
}

bootstrap();
