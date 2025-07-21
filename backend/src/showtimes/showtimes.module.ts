import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './entities/showtime.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { TicketPrice } from '../ticket-prices/entities/ticket-price.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Auditorium } from '../auditoriums/entities/auditorium.entity';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Showtime,
      Booking,
      TicketPrice,
      Movie,
      Auditorium,
    ]),
    forwardRef(() => BookingsModule),
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService, TypeOrmModule],
})
export class ShowtimesModule {}
