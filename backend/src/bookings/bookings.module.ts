// backend/src/bookings/bookings.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { BookedSeat } from './entities/booked-seat.entity';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { AuthModule } from '../auth/auth.module';
import { TicketPrice } from '../ticket-prices/entities/ticket-price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookedSeat, TicketPrice]),
    forwardRef(() => ShowtimesModule),
    AuthModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [TypeOrmModule],
})
export class BookingsModule {}
