// backend/src/theaters/theaters.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theater } from './entities/theater.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater)
    private theatersRepository: Repository<Theater>,
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
  ) {}

  findAll(): Promise<Theater[]> {
    return this.theatersRepository.find();
  }

  async findShowtimesByMovie(
    theaterId: number,
    movieId: number,
  ): Promise<Showtime[]> {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.showtimesRepository
      .createQueryBuilder('showtime')
      .innerJoin('showtime.auditorium', 'auditorium')
      .where('auditorium.theater_id = :theaterId', { theaterId })
      .andWhere('showtime.movie_id = :movieId', { movieId })
      .andWhere('showtime.start_time >= :today', { today })
      .andWhere('showtime.start_time < :tomorrow', { tomorrow })
      .orderBy('showtime.start_time', 'ASC')
      .getMany();
  }
}
