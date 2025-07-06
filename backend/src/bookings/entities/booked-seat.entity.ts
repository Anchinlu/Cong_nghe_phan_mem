// backend/src/bookings/entities/booked-seat.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('booked_seats')
export class BookedSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  row_number: number;

  @Column()
  seat_number: number;
  
  @ManyToOne('Booking', (booking: Booking) => booking.seats)
  booking: Booking;
}