// backend/src/theaters/theaters.controller.ts
import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { TheatersService } from './theaters.service';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

@Controller('theaters')
export class TheatersController {
    constructor(private readonly theatersService: TheatersService) {}

    @Get()
    findAll() {
        return this.theatersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.theatersService.findOne(id);
    }

   @Get(':id/showtimes')
    findShowtimes(
        @Param('id', ParseIntPipe) id: number,
        @Query('date', new DefaultValuePipe(getTodayDateString())) date: string,
    ) {
    return this.theatersService.findShowtimesByDate(id, date);
    }

   @Get(':theaterId/movies/:movieId/showtimes')
    findShowtimesForMovie(
        @Param('theaterId', ParseIntPipe) theaterId: number,
        @Param('movieId', ParseIntPipe) movieId: number,
    ) {
        return this.theatersService.findShowtimesByMovie(theaterId, movieId);
    }
    
}