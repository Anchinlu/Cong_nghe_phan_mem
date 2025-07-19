// backend/src/admin/admin.controller.ts
import { Controller, Post, Body, UseGuards, Put, Param, ParseIntPipe, Delete, ValidationPipe, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { AdminService } from './admin.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
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

  
}
