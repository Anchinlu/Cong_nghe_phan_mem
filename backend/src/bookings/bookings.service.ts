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
import { MailerService } from '@nestjs-modules/mailer'; 
import { TicketPrice } from '../ticket-prices/entities/ticket-price.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(BookedSeat)
    private bookedSeatsRepository: Repository<BookedSeat>,
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
    @InjectRepository(TicketPrice)
    private ticketPricesRepository: Repository<TicketPrice>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const { showtimeId, seats } = createBookingDto;

    const showtime = await this.showtimesRepository.findOne({
      where: { id: showtimeId },
      relations: ['movie', 'auditorium', 'auditorium.theater'], 
    });
    
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${showtimeId} not found`);
    }

    const existingBookedSeats = await this.bookedSeatsRepository.find({
        where: {
            booking: { showtime: { id: showtimeId } },
            row_number: In(seats.map(s => s.row)),
            seat_number: In(seats.map(s => s.col)),
        },
    });

    if (existingBookedSeats.length > 0) {
        throw new ConflictException('Một hoặc nhiều ghế đã chọn đã có người khác đặt.');
    }

    const showtimeDate = new Date(showtime.start_time);
    const dayOfWeek = showtimeDate.getDay(); 
    const dayType = (dayOfWeek === 0 || dayOfWeek === 6) ? 'CUOI_TUAN' : 'NGAY_THUONG';
    const ageGroup = 'Người Lớn'; 

    const ticketPriceInfo = await this.ticketPricesRepository.findOne({
        where: {
            theater: { id: showtime.auditorium.theater.id },
            day_type: dayType,
            age_group: ageGroup,
        }
    });

    const finalTicketPrice = ticketPriceInfo ? ticketPriceInfo.price : 75000;
    const totalPrice = seats.length * finalTicketPrice;
    


    const newBookedSeats = seats.map(seat => {
      const bookedSeat = new BookedSeat();
      bookedSeat.row_number = seat.row;
      bookedSeat.seat_number = seat.col;
      return bookedSeat;
    });

    const newBooking = this.bookingsRepository.create({
      user: user,
      showtime: showtime,
      seats: newBookedSeats,
      total_price: totalPrice,
    });
    
    const savedBooking = await this.bookingsRepository.save(newBooking);

    void this.mailerService.sendMail({
      to: user.email,
      subject: `Xác nhận đặt vé thành công tại CineBooking - Mã vé #${savedBooking.id}`,
      html: `
        <h1>Cảm ơn bạn đã đặt vé tại CineBooking!</h1>
        <p>Xin chào ${user.fullName},</p>
        <p>Đơn đặt vé của bạn đã được xác nhận thành công. Dưới đây là thông tin chi tiết:</p>
        <ul>
          <li><strong>Mã đặt vé:</strong> #${savedBooking.id}</li>
          <li><strong>Phim:</strong> ${showtime.movie.title}</li>
          <li><strong>Rạp:</strong> ${showtime.auditorium.theater.name} - ${showtime.auditorium.name}</li>
          <li><strong>Suất chiếu:</strong> ${new Date(showtime.start_time).toLocaleString('vi-VN')}</li>
          <li><strong>Ghế đã đặt:</strong> ${savedBooking.seats.map(s => `Hàng ${s.row_number}, Ghế ${s.seat_number}`).join(', ')}</li>
          <li><strong>Tổng tiền:</strong> ${savedBooking.total_price.toLocaleString('vi-VN')} VNĐ</li>
        </ul>
        <p>Vui lòng đưa email này tại quầy vé để nhận vé. Chúc bạn có một buổi xem phim vui vẻ!</p>
      `,
    });

    return savedBooking;
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