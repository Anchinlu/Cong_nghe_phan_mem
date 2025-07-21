// backend/src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { Theater } from '../theaters/entities/theater.entity';
import { User } from '../users/entities/user.entity';
import { Auditorium } from '../auditoriums/entities/auditorium.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

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
    @InjectRepository(Auditorium)
    private auditoriumsRepository: Repository<Auditorium>,
  ) {}

  // =================== QUẢN LÝ SUẤT CHIẾU ===================
  async findAllShowtimes(theaterId?: number, date?: string): Promise<Showtime[]> {
    const where: FindOptionsWhere<Showtime> = {};

    if (theaterId) {
      where.auditorium = { theater: { id: theaterId } } as any;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.startTime = Between(startDate, endDate);
    }

    return this.showtimesRepository.find({
      where,
      relations: ['movie', 'auditorium', 'auditorium.theater'],
      order: { startTime: 'DESC' },
    });
  }

  async createShowtime(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const { movieId, auditoriumId, startTime } = createShowtimeDto;

    const movie = await this.moviesRepository.findOneBy({ id: movieId });
    if (!movie) throw new NotFoundException(`Không tìm thấy phim với ID ${movieId}`);

    const auditorium = await this.auditoriumsRepository.findOneBy({ id: auditoriumId });
    if (!auditorium) throw new NotFoundException(`Không tìm thấy phòng chiếu với ID ${auditoriumId}`);

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(startTimeDate.getTime() + movie.durationMinutes * 60000);

    const newShowtime = this.showtimesRepository.create({
      movie,
      auditorium,
      startTime: startTimeDate,
      endTime: endTimeDate,
    });

    const savedShowtime = await this.showtimesRepository.save(newShowtime);

    const fullShowtime = await this.showtimesRepository.findOne({
      where: { id: savedShowtime.id },
      relations: ['movie', 'auditorium', 'auditorium.theater'],
    });

    if (!fullShowtime) throw new NotFoundException(`Không tìm thấy suất chiếu sau khi tạo.`);

    return fullShowtime;
  }

  async removeShowtime(id: number): Promise<void> {
    const result = await this.showtimesRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Không tìm thấy suất chiếu với ID ${id}`);
  }

  // =================== QUẢN LÝ PHIM ===================
  createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.preload({
      id: id,
      ...updateMovieDto,
    });
    if (!movie) throw new NotFoundException(`Không tìm thấy phim với ID ${id}`);
    return this.moviesRepository.save(movie);
  }

  async removeMovie(id: number): Promise<void> {
    const result = await this.moviesRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Không tìm thấy phim với ID ${id}`);
  }

  async getStats() {
    const movieCount = await this.moviesRepository.count();
    const showtimeCount = await this.showtimesRepository.count();
    const theaterCount = await this.theatersRepository.count();
    const userCount = await this.usersRepository.count();
    return { movieCount, showtimeCount, theaterCount, userCount };
  }

  findAllTheaters(): Promise<Theater[]> {
    return this.theatersRepository.find({ order: { city: 'ASC', name: 'ASC' } });
  }

  createTheater(createTheaterDto: CreateTheaterDto): Promise<Theater> {
    const theater = this.theatersRepository.create(createTheaterDto);
    return this.theatersRepository.save(theater);
  }

  async updateTheater(id: number, updateTheaterDto: UpdateTheaterDto): Promise<Theater> {
    const theater = await this.theatersRepository.preload({
      id: id,
      ...updateTheaterDto,
    });
    if (!theater) throw new NotFoundException(`Không tìm thấy rạp với ID ${id}`);
    return this.theatersRepository.save(theater);
  }

  async removeTheater(id: number): Promise<void> {
    const result = await this.theatersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Không tìm thấy rạp với ID ${id}`);
  }
}
