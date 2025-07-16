// backend/src/movies/movies.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  findAll(status?: string): Promise<Movie[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === 'NOW_SHOWING') {
      return this.moviesRepository.find({
        where: {
          releaseDate: LessThanOrEqual(today),
        },
      });
    }

    if (status === 'UPCOMING') {
      return this.moviesRepository.find({
        where: {
          releaseDate: MoreThan(today),
        },
      });
    }

    return this.moviesRepository.find();
  }

  findOne(id: number): Promise<Movie | null> {
    return this.moviesRepository.findOneBy({ id });
  }
}
