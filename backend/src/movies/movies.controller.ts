// backend/src/movies/movies.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  
  constructor(private readonly moviesService: MoviesService) {}

  
  @Get()
  findAll() {
    
    return this.moviesService.findAll();
  }
  @Get(':id') 
findOne(@Param('id') id: string) {
  
  return this.moviesService.findOne(+id);
}

 
}