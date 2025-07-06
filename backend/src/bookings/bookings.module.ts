// backend/src/bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { BookedSeat } from './entities/booked-seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookedSeat])],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [TypeOrmModule]
})
export class BookingsModule {}