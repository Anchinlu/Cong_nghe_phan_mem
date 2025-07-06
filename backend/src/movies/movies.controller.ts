// backend/src/movies/movies.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common'; 
import { MoviesService } from './movies.service';
import { ShowtimesService } from '../showtimes/showtimes.service';

@Controller('movies')
export class MoviesController {
  
  constructor(
    private readonly moviesService: MoviesService,
    private readonly showtimesService: ShowtimesService, 
  ) {}

  
  @Get()
  findAll(@Query('status') status?: string) {
    return this.moviesService.findAll(status);
  }
  @Get(':id') 
findOne(@Param('id') id: string) {
  
  return this.moviesService.findOne(+id);
}
@Get(':id/showtimes')
  findShowtimesForMovie(@Param('id') id: string) {
    return this.showtimesService.findByMovieId(+id);
  }
 
}