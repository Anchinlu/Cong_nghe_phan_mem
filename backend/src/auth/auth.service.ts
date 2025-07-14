import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<SafeUser> {
    const { email, password, fullName } = registerUserDto;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('Địa chỉ email này đã được sử dụng');
    }

    let salt: string;
    let hashedPassword: string;
    try {
      salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (error) {
      throw new InternalServerErrorException('Không thể mã hóa mật khẩu');
    }

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      fullName,
    });

    await this.usersRepository.save(newUser);

    const { password: omitPassword, ...result } = newUser;
    return result;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    let isMatch: boolean;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi kiểm tra mật khẩu');
    }

    if (!isMatch) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken: string = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}
