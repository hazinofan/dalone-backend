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

  // 1) Enable CORS as early as possible
  app.enableCors({
    origin: (origin, callback) => {
      // allow server-to-server or tools like curl (no origin)
      if (!origin) return callback(null, true);

      // strip trailing slashes off incoming origin
      const incoming = origin.replace(/\/+$/, '');

      if (whitelist.includes(incoming)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // (any global pipes, guards, interceptors go here…)

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  console.log(`🚀 Server running on port ${process.env.PORT || 3001}`);
}

bootstrap();
