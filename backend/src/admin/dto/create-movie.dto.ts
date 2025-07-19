import { IsString, IsNotEmpty, IsInt, IsOptional, IsDateString } from 'class-validator';

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

  @IsString()  
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  ageRating?: string;

  @IsString()  
  @IsOptional()
  trailerUrl?: string;

  @IsOptional()
  backdropUrl?: string;
}
