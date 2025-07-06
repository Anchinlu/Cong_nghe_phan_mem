// backend/src/bookings/entities/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { BookedSeat } from './booked-seat.entity';
import { JoinColumn } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne('Showtime', (showtime: Showtime) => showtime.bookings)
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;
  
  @OneToMany(() => BookedSeat, (bookedSeat) => bookedSeat.booking, { cascade: true })
  seats: BookedSeat[];

  @Column({ type: 'decimal' })
  total_price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}