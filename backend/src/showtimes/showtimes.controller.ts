// backend/src/showtimes/showtimes.controller.ts
import { Controller, Get, Param } from '@nestjs/common'; 
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes') 
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':id/seats')
  getSeats(@Param('id') id: string) {
    return this.showtimesService.getSeatLayout(+id);
  }
}