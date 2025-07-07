// backend/src/showtimes/showtimes.module.ts
import { Module, forwardRef } from '@nestjs/common'; // <-- Thêm forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './entities/showtime.entity';
import { BookingsModule } from '../bookings/bookings.module'; // Import module đặt vé

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    forwardRef(() => BookingsModule), // <-- Dùng forwardRef để phá vỡ vòng lặp
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  // Export cả hai để các module khác có thể dùng
  exports: [ShowtimesService, TypeOrmModule], 
})
export class ShowtimesModule {}