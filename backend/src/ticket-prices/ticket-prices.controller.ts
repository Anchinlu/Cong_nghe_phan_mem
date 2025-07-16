// backend/src/ticket-prices/ticket-prices.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TicketPricesService } from './ticket-prices.service';

@Controller('theaters/:theaterId/prices')
export class TicketPricesController {
  constructor(private readonly ticketPricesService: TicketPricesService) {}

  @Get()
  find(@Param('theaterId', ParseIntPipe) theaterId: number) {
    return this.ticketPricesService.findByTheaterId(theaterId);
  }
}
