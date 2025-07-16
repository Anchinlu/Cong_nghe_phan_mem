// backend/src/auth/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserPayload => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
