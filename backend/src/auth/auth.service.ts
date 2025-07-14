import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';

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

    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      fullName,
    });
    
    await this.usersRepository.save(newUser);

    const safeUser = omit<User, 'password'>(newUser, ['password']) as SafeUser;
    return safeUser;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.usersRepository.findOneBy({ email });

    const isMatch: boolean = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isMatch) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken: string = await this.jwtService.signAsync(payload);
    
    return {
      access_token: accessToken,
    };
  }
}
