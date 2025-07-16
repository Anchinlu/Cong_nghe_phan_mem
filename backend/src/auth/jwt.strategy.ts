// backend/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

// Định nghĩa một kiểu mới không chứa mật khẩu
export type UserPayload = Omit<User, 'password'>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    const secret = configService.get('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // SỬA Ở ĐÂY: Thay đổi kiểu dữ liệu trả về
  async validate(payload: {
    sub: number;
    email: string;
  }): Promise<UserPayload> {
    const { sub: id } = payload;
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Loại bỏ mật khẩu trước khi trả về
    const { password, ...result } = user;
    return result;
  }
}
