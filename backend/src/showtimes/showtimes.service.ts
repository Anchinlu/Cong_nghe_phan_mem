// backend/src/showtimes/showtimes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
@InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,

  ) {}
  async findByMovieId(movieId: number): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      where: {
        movie: { id: movieId },
      },
      
      relations: ['auditorium', 'auditorium.theater'], 
      order: {
        start_time: 'ASC',
      },
    });
  }
  async getSeatLayout(showtimeId: number) {
    // 1. Lấy thông tin suất chiếu và sơ đồ ghế của phòng chiếu
    const showtime = await this.showtimesRepository.findOne({
      where: { id: showtimeId },
      relations: ['auditorium'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${showtimeId} not found`);
    }

    // 2. Lấy tất cả các ghế đã được đặt cho suất chiếu 
    const bookings = await this.bookingsRepository.find({
      where: { showtime: { id: showtimeId } },
      relations: ['seats'],
    });

    const bookedSeats = bookings.flatMap(booking => 
        booking.seats.map(seat => ({
            row: seat.row_number,
            col: seat.seat_number,
        }))
    );
    
    // 3. Trả về sơ đồ ghế và danh sách ghế đã đặt
    return {
      seatLayout: showtime.auditorium.seat_layout,
      bookedSeats: bookedSeats,
         };
    }
}