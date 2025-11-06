import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidatedTokenPayload } from '../interfaces/token-validation.interface';

// Decorator to get Firebase UID from validated token
export const FirebaseUid = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.firebaseUid;
    },
);

// Decorator to get User ID from JWT token
export const UserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.userId;
    },
);

// Decorator to get email from validated token
export const UserEmail = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.email;
    },
);

// Decorator to get full user info from Firebase validation
export const UserInfo = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): ValidatedTokenPayload => {
        const request = ctx.switchToHttp().getRequest();
        return request.userInfo;
    },
);

// Decorator to get the validated token
export const ValidatedToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.validatedToken || request.validatedAccessToken;
    },
);
