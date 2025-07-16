// backend/src/auditoriums/entities/auditorium.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Theater } from '../../theaters/entities/theater.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { JoinColumn } from 'typeorm';

@Entity('auditoriums')
export class Auditorium {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  seat_layout: {
    rows: number;
    cols: number;
    unavailable?: { row: number; col: number }[];
  };

  @ManyToOne(() => Theater, (theater) => theater.auditoriums)
  @JoinColumn({ name: 'theater_id' })
  theater: Theater;

  @OneToMany('Showtime', (showtime: Showtime) => showtime.auditorium)
  showtimes: Showtime[];
}
