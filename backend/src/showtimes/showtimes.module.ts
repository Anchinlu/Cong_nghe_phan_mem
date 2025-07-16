// backend/src/showtimes/showtimes.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './entities/showtime.entity';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    forwardRef(() => BookingsModule),
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],

  exports: [ShowtimesService, TypeOrmModule],
})
export class ShowtimesModule {}
