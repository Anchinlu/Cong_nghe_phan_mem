// backend/src/showtimes/showtimes.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get('search')
  searchShowtimes(
    @Query('movieId') movieId: string,
    @Query('date') date: string,
    @Query('city') city?: string,
  ) {
    return this.showtimesService.search(+movieId, date, city);
  }

  @Get(':id/seats')
  getSeats(@Param('id') id: string) {
    return this.showtimesService.getSeatLayout(+id);
  }
  @Get('/movie/:id')
  async findByMovie(@Param('id') id: string) {
    const showtimes = await this.showtimesService.findByMovieId(+id);

    return showtimes.map(s => ({
      id: s.id,
      startTime: s.startTime, 
      endTime: s.endTime,  
      auditorium: {
        name: s.auditorium.name,
        theater: {
          name: s.auditorium.theater.name,
        },
      },
    }));
  }
}
