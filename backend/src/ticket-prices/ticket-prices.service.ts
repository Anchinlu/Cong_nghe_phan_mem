// backend/src/ticket-prices/ticket-prices.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketPrice } from './entities/ticket-price.entity';

@Injectable()
export class TicketPricesService {
  constructor(
    @InjectRepository(TicketPrice)
    private ticketPricesRepository: Repository<TicketPrice>,
  ) {}

  findByTheaterId(theaterId: number): Promise<TicketPrice[]> {
    return this.ticketPricesRepository.find({
      where: { theater: { id: theaterId } },
    });
  }
}
