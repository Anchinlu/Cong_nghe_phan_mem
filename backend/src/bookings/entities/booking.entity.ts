import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
// KHÔNG IMPORT SHOWTIME VÀ BOOKEDSEAT Ở ĐÂY

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  // Sửa lỗi: Dùng chuỗi 'Showtime'
  @ManyToOne('Showtime', (showtime: any) => showtime.bookings)
  showtime: any;
  
  // Sửa lỗi: Dùng chuỗi 'BookedSeat'
  @OneToMany('BookedSeat', (bookedSeat: any) => bookedSeat.booking, { cascade: true })
  seats: any[];

  @Column({ type: 'decimal' })
  total_price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}