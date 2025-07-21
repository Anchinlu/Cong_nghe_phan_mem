// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

// Import các module chức năng
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { TheatersModule } from './theaters/theaters.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { BookingsModule } from './bookings/bookings.module';
import { TicketPricesModule } from './ticket-prices/ticket-prices.module';
import { AdminModule } from './admin/admin.module';
import { AuditoriumsModule } from './auditoriums/auditoriums.module';

// Import các entity
import { Movie } from './movies/entities/movie.entity';
import { User } from './users/entities/user.entity';
import { Theater } from './theaters/entities/theater.entity';
import { Showtime } from './showtimes/entities/showtime.entity';
import { Booking } from './bookings/entities/booking.entity';
import { BookedSeat } from './bookings/entities/booked-seat.entity';
import { TicketPrice } from './ticket-prices/entities/ticket-price.entity';
import { Auditorium } from './auditoriums/entities/auditorium.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT', '5432')),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          Movie,
          User,
          Theater,
          Showtime,
          Auditorium,
          Booking,
          BookedSeat,
          TicketPrice,
        ],
        synchronize: true,
      }),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get('MAIL_FROM'),
        },
      }),
    }),

    MoviesModule,
    AuthModule,
    TheatersModule,
    ShowtimesModule,
    BookingsModule,
    TicketPricesModule,
    AdminModule,
    AuditoriumsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
