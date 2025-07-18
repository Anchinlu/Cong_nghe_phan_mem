// backend/src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, fullName } = registerUserDto;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('Địa chỉ email này đã được sử dụng');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      fullName,
    });

    await this.usersRepository.save(newUser);

    // THAY ĐỔI Ở ĐÂY
    const { password: _, ...result } = newUser;
    return result;
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
