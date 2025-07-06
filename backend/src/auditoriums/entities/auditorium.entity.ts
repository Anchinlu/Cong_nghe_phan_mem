import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


@Entity('auditoriums')
export class Auditorium {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  seat_layout: { rows: number; cols: number; unavailable?: { row: number, col: number }[] };

  
  @ManyToOne('Theater', (theater: any) => theater.auditoriums)
  theater: any;
  
 
  @OneToMany('Showtime', (showtime: any) => showtime.auditorium)
  showtimes: any[];
}