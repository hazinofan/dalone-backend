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
      // allow non-browser requests
      if (!origin) return callback(null, true);

      // normalize both sides to drop trailing slash
      const incoming = origin.replace(/\/+$/, '');
      if (whitelist.includes(incoming)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
