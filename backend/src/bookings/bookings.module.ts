// backend/src/bookings/bookings.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { BookedSeat } from './entities/booked-seat.entity';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookedSeat]),
    forwardRef(() => ShowtimesModule), // Dùng forwardRef để phá vỡ vòng lặp
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [TypeOrmModule]
})
export class BookingsModule {}