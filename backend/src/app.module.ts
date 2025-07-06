// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

// Import các module và entity
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { TheatersModule } from './theaters/theaters.module';
import { AuditoriumsModule } from './auditoriums/auditoriums.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { BookingsModule } from './bookings/bookings.module';

import { Movie } from './movies/entities/movie.entity';
import { User } from './users/entities/user.entity';
import { Theater } from './theaters/entities/theater.entity';
import { Auditorium } from './auditoriums/entities/auditorium.entity';
import { Showtime } from './showtimes/entities/showtime.entity';
import { Booking } from './bookings/entities/booking.entity';
import { BookedSeat } from './bookings/entities/booked-seat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD, 
      database: process.env.DATABASE_NAME,
      
      // Thêm tất cả các entity vào đây để TypeORM nhận diện
      entities: [
        Movie, 
        User, 
        Theater, 
        Auditorium, 
        Showtime, 
        Booking, 
        BookedSeat
      ],
      
      synchronize: true,
    }),

    // Import các module mới
    MoviesModule,
    
    AuthModule,
    TheatersModule,
    AuditoriumsModule,
    ShowtimesModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}