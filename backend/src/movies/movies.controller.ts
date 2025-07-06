// backend/src/movies/movies.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common'; 
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  
  constructor(private readonly moviesService: MoviesService) {}

  
  @Get()
  findAll(@Query('status') status?: string) {
    return this.moviesService.findAll(status);
  }
  @Get(':id') 
findOne(@Param('id') id: string) {
  
  return this.moviesService.findOne(+id);
}

 
}