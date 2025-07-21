// backend/src/theaters/theaters.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { Theater } from './entities/theater.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { Auditorium } from '../auditoriums/entities/auditorium.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Theater, Showtime, Auditorium])], 
  controllers: [TheatersController],
  providers: [TheatersService],
})
export class TheatersModule {}