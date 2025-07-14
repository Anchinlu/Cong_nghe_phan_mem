// backend/src/showtimes/showtimes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
     async search(
        movieId: number, 
        date: string, 
        city?: string
    ): Promise<Showtime[]> {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const query = this.showtimesRepository
            .createQueryBuilder('showtime')
            .innerJoinAndSelect('showtime.auditorium', 'auditorium')
            .innerJoinAndSelect('auditorium.theater', 'theater')
            .where('showtime.movie_id = :movieId', { movieId })
            .andWhere('showtime.start_time BETWEEN :startDate AND :endDate', { startDate, endDate });

        if (city) {
            query.andWhere('theater.city = :city', { city });
        }

        return query
            .orderBy('theater.name', 'ASC')
            .addOrderBy('showtime.start_time', 'ASC')
            .getMany();
    }
    
}