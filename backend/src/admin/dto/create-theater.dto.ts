// backend/src/admin/dto/create-theater.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTheaterDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên rạp không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'Thành phố không được để trống' })
  city: string;
}