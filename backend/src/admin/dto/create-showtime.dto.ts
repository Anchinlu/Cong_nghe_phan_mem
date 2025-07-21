// backend/src/admin/dto/create-showtime.dto.ts
import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateShowtimeDto {
  @IsInt({ message: 'Movie ID phải là một số nguyên' })
  @IsNotEmpty({ message: 'Vui lòng chọn phim' })
  movieId: number;

  @IsInt({ message: 'Auditorium ID phải là một số nguyên' })
  @IsNotEmpty({ message: 'Vui lòng chọn phòng chiếu' })
  auditoriumId: number;

  @IsDateString({}, { message: 'Thời gian bắt đầu không hợp lệ' })
  @IsNotEmpty({ message: 'Vui lòng nhập thời gian bắt đầu' })
  startTime: string;
}
