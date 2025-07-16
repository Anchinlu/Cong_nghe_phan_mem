// backend/src/ticket-prices/entities/ticket-price.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Theater } from '../../theaters/entities/theater.entity';

@Entity('ticket_prices')
export class TicketPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Theater, { eager: true })
  @JoinColumn({ name: 'theater_id' })
  theater: Theater;

  @Column({ comment: 'Loại ngày: NGAY_THUONG hoặc CUOI_TUAN' })
  day_type: string;

  @Column({ comment: 'Nhóm tuổi: NguoiLon, TreEm, HSSV' })
  age_group: string;

  @Column({ type: 'decimal' })
  price: number;
}
