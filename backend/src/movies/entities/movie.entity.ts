// backend/src/movies/entities/movie.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
  @Column({ name: 'duration_minutes', type: 'int', nullable: true })
  durationMinutes: number;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ name: 'poster_url', type: 'varchar', nullable: true })
  posterUrl: string;

  
  @Column({ nullable: true })
  genre: string;

  @Column({ name: 'age_rating', nullable: true })
  ageRating: string;

  @Column({ name: 'subtitle_info', nullable: true })
  subtitleInfo: string;

  @Column({ name: 'trailer_url', nullable: true })
  trailerUrl: string;

  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl: string;
}