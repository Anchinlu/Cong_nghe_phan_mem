// backend/src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { Theater } from '../theaters/entities/theater.entity';
import { User } from '../users/entities/user.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Showtime) 
    private showtimesRepository: Repository<Showtime>,
    @InjectRepository(Theater) 
    private theatersRepository: Repository<Theater>,
    @InjectRepository(User) 
    private usersRepository: Repository<User>,
    
  ) {}
  async getStats() {
    const movieCount = await this.moviesRepository.count();
    const showtimeCount = await this.showtimesRepository.count();
    const theaterCount = await this.theatersRepository.count();
    const userCount = await this.usersRepository.count();

    return {
      movieCount,
      showtimeCount,
      theaterCount,
      userCount,
    };
  }

  createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.preload({
      id: id,
      ...updateMovieDto,
    });
    if (!movie) {
      throw new NotFoundException(`Không tìm thấy phim với ID ${id}`);
    }
    return this.moviesRepository.save(movie);
  }

  async removeMovie(id: number): Promise<void> {
    const result = await this.moviesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy phim với ID ${id}`);
    }
  }
}
