// backend/src/movies/entities/movie.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies') // Nói cho TypeORM biết class này ánh xạ tới bảng 'movies'
export class Movie {
  @PrimaryGeneratedColumn() // Đánh dấu đây là cột khóa chính và tự động tăng
  id: number;

  @Column() // Đánh dấu đây là một cột trong bảng
  title: string;

  @Column()
  description: string;

  // Dùng object để cấu hình chi tiết hơn cho cột
  @Column({ name: 'duration_minutes', type: 'int', nullable: true })
  durationMinutes: number;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ name: 'poster_url', type: 'varchar', nullable: true })
  posterUrl: string;
}