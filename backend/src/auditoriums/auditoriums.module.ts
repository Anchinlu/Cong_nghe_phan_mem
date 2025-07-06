import { Module } from '@nestjs/common';
import { AuditoriumsController } from './auditoriums.controller';
import { AuditoriumsService } from './auditoriums.service';

@Module({
  controllers: [AuditoriumsController],
  providers: [AuditoriumsService]
})
export class AuditoriumsModule {}
