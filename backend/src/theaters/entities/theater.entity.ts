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

  @OneToMany(() => Auditorium, (auditorium) => auditorium.theater)
  auditoriums: Auditorium[];
}