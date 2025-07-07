// backend/src/bookings/bookings.controller.ts
import { Controller, Post, Body, UseGuards, ValidationPipe, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetUser } from '../auth/get-user.decorator'; 
import { User } from '../users/entities/user.entity';
 

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) 
  create(
    @Body(new ValidationPipe()) createBookingDto: CreateBookingDto,
    @GetUser() user: User, 
  ) {
    return this.bookingsService.create(createBookingDto, user);
  }
   @Get('/my-history')
  @UseGuards(AuthGuard('jwt')) // Bảo vệ route này
  findUserBookings(@GetUser() user: User) {
    return this.bookingsService.findForUser(user);
  }
}