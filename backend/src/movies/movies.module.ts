// backend/src/movies/movies.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller'; // <--- Phải có dòng import này
import { Movie } from './entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MoviesController], // <--- Tên MoviesController phải có ở đây
  providers: [MoviesService],
})
export class MoviesModule {}