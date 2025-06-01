// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfessionalProfileModule } from './professional-profile/professional-profile.module';
import { AppController } from './app.controller';
import { ClientProfileModule } from './client-profile/client-profile.module';
import { WorksModule } from './work/work.module';
import { GigModule } from './gig/gig.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SocialsModule } from './socials/socials.module';

@Module({
  imports: [
    // serve anything in /public under the /public URL path
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ProfessionalProfileModule,
    ClientProfileModule,
    WorksModule,
    GigModule,
    ReviewsModule,
    SocialsModule,
  ],
  controllers: [
    AppController, // ← register your file‐upload controller here
  ],
})
export class AppModule {}
