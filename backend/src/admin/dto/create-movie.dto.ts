// backend/src/admin/dto/create-movie.dto.ts
import { IsString, IsNotEmpty, IsInt, IsOptional, IsUrl, IsDateString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  durationMinutes: number;

  @IsDateString()
  releaseDate: Date;

  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  ageRating?: string;

  @IsUrl()
  @IsOptional()
  trailerUrl?: string;

  @IsUrl()
  @IsOptional()
  backdropUrl?: string;
}
