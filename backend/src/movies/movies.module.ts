// backend/src/movies/movies.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), ShowtimesModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
