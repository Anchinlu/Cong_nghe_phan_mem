// backend/src/bookings/dto/create-booking.dto.ts
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SeatDto {
  @IsInt()
  row: number;

  @IsInt()
  col: number;
}

export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  showtimeId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}