// backend/src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Movie } from '../movies/entities/movie.entity';
import { AuthModule } from '../auth/auth.module';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { Theater } from '../theaters/entities/theater.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Showtime, Theater, User]), 
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}