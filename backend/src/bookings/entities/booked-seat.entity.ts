// backend/src/bookings/entities/booked-seat.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from './booking.entity';
import { JoinColumn } from 'typeorm';

@Entity('booked_seats')
export class BookedSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  row_number: number;

  @Column()
  seat_number: number;
  
  @ManyToOne('Booking', (booking: Booking) => booking.seats)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}