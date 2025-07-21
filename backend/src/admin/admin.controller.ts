import { 
  Controller, Post, Body, UseGuards, Put, Param, ParseIntPipe, Delete, ValidationPipe, Get, Query 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { AdminService } from './admin.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('showtimes')
  findAllShowtimes(
    @Query('theaterId') theaterId?: string,
    @Query('date') date?: string,
  ) {
    return this.adminService.findAllShowtimes(
      theaterId ? +theaterId : undefined,
      date,
    );
  }

  @Post('showtimes')
  createShowtime(@Body(ValidationPipe) createShowtimeDto: CreateShowtimeDto) {
    return this.adminService.createShowtime(createShowtimeDto);
  }

  @Delete('showtimes/:id')
  removeShowtime(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeShowtime(id);
  }

  @Post('movies')
  createMovie(@Body(ValidationPipe) createMovieDto: CreateMovieDto) {
    return this.adminService.createMovie(createMovieDto);
  }

  @Put('movies/:id')
  updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMovieDto: UpdateMovieDto,
  ) {
    return this.adminService.updateMovie(id, updateMovieDto);
  }

  @Delete('movies/:id')
  removeMovie(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeMovie(id);
  }

  @Get('theaters')
  findAllTheaters() {
    return this.adminService.findAllTheaters();
  }

  @Post('theaters')
  createTheater(@Body(ValidationPipe) createTheaterDto: CreateTheaterDto) {
    return this.adminService.createTheater(createTheaterDto);
  }

  @Put('theaters/:id')
  updateTheater(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTheaterDto: UpdateTheaterDto,
  ) {
    return this.adminService.updateTheater(id, updateTheaterDto);
  }

  @Delete('theaters/:id')
  removeTheater(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeTheater(id);
  }

  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Delete('users/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeUser(id);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }
}
