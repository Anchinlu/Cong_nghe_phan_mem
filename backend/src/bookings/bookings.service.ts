// backend/src/bookings/bookings.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookedSeat } from './entities/booked-seat.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(BookedSeat)
    private bookedSeatsRepository: Repository<BookedSeat>,
    @InjectRepository(Showtime) // <-- Đảm bảo dòng này có tồn tại
    private showtimesRepository: Repository<Showtime>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    user: User,
  ): Promise<Booking> {
    const { showtimeId, seats } = createBookingDto;

    const showtime = await this.showtimesRepository.findOneBy({
      id: showtimeId,
    });
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${showtimeId} not found`);
    }

    const existingBookedSeats = await this.bookedSeatsRepository.find({
      where: {
        booking: { showtime: { id: showtimeId } },
        row_number: In(seats.map((s) => s.row)),
        seat_number: In(seats.map((s) => s.col)),
      },
    });

    if (existingBookedSeats.length > 0) {
      throw new ConflictException(
        'One or more selected seats are already booked.',
      );
    }

    const newBookedSeats = seats.map((seat) => {
      const bookedSeat = new BookedSeat();
      bookedSeat.row_number = seat.row;
      bookedSeat.seat_number = seat.col;
      return bookedSeat;
    });

    const newBooking = this.bookingsRepository.create({
      user: user,
      showtime: showtime,
      seats: newBookedSeats,
      total_price: seats.length * 75000,
    });

    return this.bookingsRepository.save(newBooking);
  }
  async findForUser(user: User): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: user.id } },

      relations: [
        'showtime',
        'showtime.movie',
        'showtime.auditorium',
        'showtime.auditorium.theater',
        'seats',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
