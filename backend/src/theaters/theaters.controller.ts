// backend/src/theaters/theaters.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { TheatersService } from './theaters.service';

@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get()
  findAll() {
    return this.theatersService.findAll();
  }
  @Get(':theaterId/movies/:movieId/showtimes')
  findShowtimes(
    @Param('theaterId') theaterId: string,
    @Param('movieId') movieId: string,
  ) {
    return this.theatersService.findShowtimesByMovie(+theaterId, +movieId);
  }
}
