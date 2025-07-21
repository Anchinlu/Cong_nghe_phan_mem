// backend/src/auditoriums/auditoriums.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditorium } from './entities/auditorium.entity';

@Injectable()
export class AuditoriumsService {
  constructor(
    @InjectRepository(Auditorium)
    private auditoriumsRepository: Repository<Auditorium>,
  ) {}

  findAll(): Promise<Auditorium[]> {
    return this.auditoriumsRepository.find({
      relations: ['theater'],
    });
  }
}