// backend/src/theaters/entities/theater.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Auditorium } from '../../auditoriums/entities/auditorium.entity';

@Entity('theaters')
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ default: 'TP. HCM' })
  city: string;

  @OneToMany(() => Auditorium, (auditorium) => auditorium.theater)
  auditoriums: Auditorium[];
}
