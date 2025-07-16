// backend/src/ticket-prices/ticket-prices.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketPrice } from './entities/ticket-price.entity';
import { TicketPricesController } from './ticket-prices.controller';
import { TicketPricesService } from './ticket-prices.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketPrice])],
  controllers: [TicketPricesController],
  providers: [TicketPricesService],
})
export class TicketPricesModule {}