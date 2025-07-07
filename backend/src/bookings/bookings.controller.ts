// backend/src/bookings/bookings.controller.ts
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  

  @Post()
  create(
    @Body(new ValidationPipe()) createBookingDto: CreateBookingDto,
  ) {
    
    const mockUser = { id: 1 } as User; 
   

    return this.bookingsService.create(createBookingDto, mockUser);
  }
}