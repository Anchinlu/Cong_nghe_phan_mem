import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity('booked_seats')
export class BookedSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  row_number: number;

  @Column()
  seat_number: number;
  
  
  @ManyToOne('Booking', (booking: any) => booking.seats)
  booking: any;
}