// backend/src/auditoriums/auditoriums.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AuditoriumsService } from './auditoriums.service';

@Controller('auditoriums')
export class AuditoriumsController {
  constructor(private readonly auditoriumsService: AuditoriumsService) {}

  @Get()
  findAll() {
    return this.auditoriumsService.findAll();
  }
}