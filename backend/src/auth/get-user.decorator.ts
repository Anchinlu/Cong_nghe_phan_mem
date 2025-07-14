// backend/src/auth/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new Error('User not found in request. Did you forget to apply AuthGuard?');
    }

    return request.user as UserPayload;
  },
);
