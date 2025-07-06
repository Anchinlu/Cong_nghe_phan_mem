// backend/src/showtimes/entities/showtime.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'; // ĐÃ THÊM OneToMany vào đây
import { Movie } from '../../movies/entities/movie.entity';
import { Auditorium } from '../../auditoriums/entities/auditorium.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @ManyToOne(() => Movie, movie => movie.id)
  movie: Movie;

  @ManyToOne(() => Auditorium, auditorium => auditorium.showtimes)
  auditorium: Auditorium;

  @OneToMany(() => Booking, (booking) => booking.showtime)
  bookings: Booking[];
}