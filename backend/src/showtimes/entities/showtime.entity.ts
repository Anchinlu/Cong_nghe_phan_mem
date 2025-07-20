// backend/src/showtimes/entities/showtime.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Auditorium } from '../../auditoriums/entities/auditorium.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { JoinColumn } from 'typeorm';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;  

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;    

  @ManyToOne(() => Movie, (movie) => movie.id)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Auditorium, (auditorium: Auditorium) => auditorium.showtimes)
  @JoinColumn({ name: 'auditorium_id' })
  auditorium: Auditorium;

  @OneToMany('Booking', (booking: Booking) => booking.showtime)
  bookings: Booking[];
}

