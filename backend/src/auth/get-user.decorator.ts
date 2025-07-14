// backend/src/auth/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

type UserPayload = Omit<User, 'password'>;

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: UserPayload }>();
    return request.user;
  },
);