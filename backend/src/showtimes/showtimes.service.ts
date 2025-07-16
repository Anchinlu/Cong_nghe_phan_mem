// backend/src/showtimes/showtimes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { TicketPrice } from '../ticket-prices/entities/ticket-price.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
@InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
@InjectRepository(TicketPrice) 
    private ticketPricesRepository: Repository<TicketPrice>,

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
    // 1. Lấy thông tin suất chiếu VÀ thông tin rạp
   const showtime = await this.showtimesRepository.findOne({
      where: { id: showtimeId },
      relations: ['auditorium', 'auditorium.theater'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${showtimeId} not found`);
    }

    // 2. Xác định loại ngày và lấy giá vé
    const showtimeDate = new Date(showtime.start_time);
    const dayOfWeek = showtimeDate.getDay();
    const dayType = (dayOfWeek === 0 || dayOfWeek === 6) ? 'CUOI_TUAN' : 'NGAY_THUONG';
    
    const ticketPriceInfo = await this.ticketPricesRepository.findOne({
        where: {
            theater: { id: showtime.auditorium.theater.id },
            day_type: dayType,
            age_group: 'Người Lớn', 
        }
    });
    
    const ticketPrice = ticketPriceInfo ? Number(ticketPriceInfo.price) : 75000;

    
     const bookings = await this.bookingsRepository.find({
      where: { showtime: { id: showtimeId } },
      relations: ['seats'],
    });
    const bookedSeats = bookings.flatMap(b => b.seats.map(s => ({ row: s.row_number, col: s.seat_number })));
    
    return {
      seatLayout: showtime.auditorium.seat_layout,
      bookedSeats: bookedSeats,
      ticketPrice: ticketPrice,
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