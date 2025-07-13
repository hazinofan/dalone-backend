// src/app.module.ts
import { MongooseModule } from '@nestjs/mongoose';
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
import { FollowersModule } from './followers/followers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MessagesModule } from './messages/messages.module';
import { AvailabilityModule } from './availability/availability.module';
import { ReservationModule } from './reservation/reservation.module';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),

    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    // MySQL connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql' as const,
        host: cfg.get<string>('DB_HOST'),
        port: +cfg.get<string>('DB_PORT')!,
        username: cfg.get<string>('DB_USERNAME'),
        password: cfg.get<string>('DB_PASSWORD'),
        database: cfg.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: {
          ca: readFileSync(join(__dirname, '..', 'certs', 'aiven-ca.pem')),
          // in dev you can set this to false, but in prod leave true
          rejectUnauthorized: true,
        },
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
    FollowersModule,
    NotificationsModule,
    MessagesModule,
    AvailabilityModule,
    ReservationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
