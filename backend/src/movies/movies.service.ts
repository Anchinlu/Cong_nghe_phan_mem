// backend/src/movies/movies.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  
  constructor(
    @InjectRepository(Movie) 
    private moviesRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {

    return this.moviesRepository.find();
  }
  
  findOne(id: number): Promise<Movie | null> {
  return this.moviesRepository.findOneBy({ id });
}

 
}