import {
    Controller,
    Post,
    HttpStatus,
    Logger,
    UseGuards,
    Body,
    HttpException,
    Delete,
    Put,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
    AuthResponseDto,
    TokenValidationResponseDto,
    SignInResponseDto,
} from '../dto/auth-request.dto';
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard';
import { ValidatedToken, FirebaseUid } from '../decorators/auth.decorator';
import { ZaloAuthService } from '../services/zalo-auth.service';
import { RedisAuthService } from '../services/redis-auth.service';
import { RequestOtpDto } from '../dto/request-otp.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { JwtAuthGuard, TokenType } from '../guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly zaloAuthService: ZaloAuthService,
        private readonly redisAuthService: RedisAuthService,
    ) {}

    @Post('sign-up')
    @UseGuards(FirebaseAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Sign up user with Firebase token',
        description: 'Creates a new user account using Firebase ID token',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User created successfully',
        type: AuthResponseDto,
        schema: {
            example: {
                success: true,
                message: 'User created successfully',
                data: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    uid: 'firebase-uid-123',
                    email: 'user@example.com',
                    name: 'John Doe',
                    picture: 'https://example.com/avatar.jpg',
                    emailVerified: true,
                    role: 'user',
                    provider: 'google',
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Invalid request data or Firebase token',
        schema: {
            example: {
                message: 'Invalid Firebase token',
                error: 'Bad Request',
                statusCode: 400,
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or expired Firebase token',
        schema: {
            example: {
                message: 'Authorization header is required',
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    })
    @ApiConflictResponse({
        description: 'User already exists',
        schema: {
            example: {
                message: 'User already exists',
                error: 'Conflict',
                statusCode: 409,
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description:
            'Internal server error or user-service communication failure',
        schema: {
            example: {
                message: 'Failed to create user in user-service',
                error: 'Internal Server Error',
                statusCode: 500,
            },
        },
    })
    async signUp(@ValidatedToken() idToken: string): Promise<AuthResponseDto> {
        try {
            this.logger.log('Sign-up request received');
            const result = await this.authService.signUp(idToken);
            this.logger.log(`User signed up successfully: ${result.data.id}`);
            return result;
        } catch (error) {
            this.logger.error('Sign-up failed:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: error.message || 'Sign-up failed',
                    error: 'Internal Server Error',
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('sign-in')
    @UseGuards(FirebaseAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Sign in user with Firebase token or OTP',
        description:
            'Authenticates user with Firebase ID token or phone number + OTP and returns JWT access and refresh tokens',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User signed in successfully',
        type: SignInResponseDto,
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Invalid request data, Firebase token, or OTP',
        schema: {
            example: {
                message: 'Invalid OTP or OTP expired',
                error: 'Bad Request',
                statusCode: 400,
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or expired Firebase token, or sign-in failed',
        schema: {
            example: {
                message: 'Authorization header is required',
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'User not found - please sign up first',
        schema: {
            example: {
                message: 'User not found. Please sign up first.',
                error: 'Not Found',
                statusCode: 404,
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error during sign-in process',
        schema: {
            example: {
                message: 'Sign-in failed',
                error: 'Internal Server Error',
                statusCode: 500,
            },
        },
    })
    async signIn(
        @ValidatedToken() idToken: string,
        @Body() body?: SignInDto,
    ): Promise<SignInResponseDto> {
        try {
            if (idToken) {
                this.logger.log('Sign-in request received with Firebase token');
                const result = await this.authService.signIn(idToken);
                this.logger.log(
                    'User signed in successfully with Firebase token',
                );
                return result;
            } else if (body.phone && body.otp) {
                this.logger.log('Sign-in request received with phone and OTP');

                // Validate OTP using Redis service
                const isOtpValid =
                    await this.redisAuthService.validateAndDeleteOtp(
                        body.phone,
                        body.otp,
                    );

                if (!isOtpValid) {
                    this.logger.error(`Invalid OTP for phone: ${body.phone}`);
                    throw new HttpException(
                        {
                            message: 'Invalid OTP or OTP expired',
                            error: 'Bad Request',
                            statusCode: HttpStatus.BAD_REQUEST,
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }

                // OTP is valid, proceed with sign-in
                const result = await this.authService.signInWithOtp(body.phone);
                this.logger.log(
                    'User signed in successfully with phone and OTP',
                );
                return result;
            }

            this.logger.error('Sign-in request received with invalid data');
            throw new HttpException(
                {
                    message:
                        'Invalid request data. Provide either Firebase token in Authorization header or phone + OTP in request body',
                    error: 'Bad Request',
                    statusCode: HttpStatus.BAD_REQUEST,
                },
                HttpStatus.BAD_REQUEST,
            );
        } catch (error) {
            this.logger.error('Sign-in failed:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: error.message || 'Sign-in failed',
                    error: 'Internal Server Error',
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete('sign-out')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Sign out user',
        description:
            'Signs out user by revoking tokens and clearing stored credentials',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User signed out successfully',
        schema: {
            example: {
                success: true,
                message: 'User signed out successfully',
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or missing Firebase token',
        schema: {
            example: {
                message: 'Authorization header is required',
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        schema: {
            example: {
                message: 'User not found with Firebase UID: firebase-uid-123',
                error: 'Not Found',
                statusCode: 404,
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error during sign-out process',
        schema: {
            example: {
                message: 'Sign-out failed',
                error: 'Internal Server Error',
                statusCode: 500,
            },
        },
    })
    async signOut(@FirebaseUid() firebaseUid: string) {
        try {
            this.logger.log(
                `Sign-out request received for Firebase UID: ${firebaseUid}`,
            );
            await this.authService.signOut(firebaseUid);
            this.logger.log(`User signed out successfully: ${firebaseUid}`);

            return {
                success: true,
                message: 'User signed out successfully',
            };
        } catch (error) {
            this.logger.error('Sign-out failed:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: error.message || 'Sign-out failed',
                    error: 'Internal Server Error',
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('request-otp')
    @ApiOperation({
        summary: 'Send OTP via Zalo ZNS',
        description:
            'Send OTP to user phone number using Zalo OA ZNS. Rate limited to 4 requests per hour per phone number.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'OTP sent successfully',
        schema: {
            example: {
                message: 'OTP sent successfully',
                statusCode: HttpStatus.OK,
                data: {
                    remainingAttempts: 3,
                    otpExpiresIn: 120, // seconds
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Invalid phone number',
        schema: {
            example: {
                message: 'Invalid phone number',
                error: 'Bad Request',
                statusCode: 400,
            },
        },
    })
    @ApiTooManyRequestsResponse({
        description: 'Rate limit exceeded for OTP requests',
        schema: {
            example: {
                message: 'Too many OTP requests. Please try again later.',
                error: 'Too Many Requests',
                statusCode: 429,
                data: {
                    maxAttempts: 4,
                    resetTime: '2024-01-01T01:00:00.000Z',
                },
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Failed to send OTP',
        schema: {
            example: {
                message: 'Failed to send OTP',
                error: 'Internal Server Error',
                statusCode: 500,
            },
        },
    })
    async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
        try {
            const { phone } = requestOtpDto;

            if (!phone) {
                throw new HttpException(
                    {
                        message: 'Phone number is required',
                        error: 'Bad Request',
                        statusCode: HttpStatus.BAD_REQUEST,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Check rate limit
            const isRateLimited =
                await this.redisAuthService.isRateLimited(phone);
            if (isRateLimited) {
                const rateLimitTTL =
                    await this.redisAuthService.getRateLimitTTL(phone);
                const resetTime = new Date(
                    Date.now() + rateLimitTTL * 1000,
                ).toISOString();

                this.logger.warn(`Rate limit exceeded for phone: ${phone}`);
                throw new HttpException(
                    {
                        message:
                            'Too many OTP requests. Please try again later.',
                        error: 'Too Many Requests',
                        statusCode: HttpStatus.TOO_MANY_REQUESTS,
                        data: {
                            maxAttempts: 4,
                            resetTime,
                        },
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            this.logger.log(`Sending OTP to ${phone}`);

            // Generate and send OTP via Zalo
            const otp = await this.zaloAuthService.sendOtp(phone);
            this.logger.log(`OTP sent successfully to ${phone}: ${otp}`);

            // Store OTP in Redis with 2-minute TTL
            await this.redisAuthService.storeOtp(phone, otp);

            // Increment rate limit counter
            const attempts =
                await this.redisAuthService.incrementRateLimit(phone);
            const remainingAttempts = Math.max(0, 4 - attempts);

            this.logger.log(
                `OTP sent successfully to ${phone}, remaining attempts: ${remainingAttempts}`,
            );

            return {
                message: 'OTP sent successfully',
                statusCode: HttpStatus.OK,
                data: {
                    remainingAttempts,
                    otpExpiresIn: 120, // 2 minutes
                },
            };
        } catch (error) {
            this.logger.error('Send OTP failed:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: error.message || 'Failed to send OTP',
                    error: 'Internal Server Error',
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('validate-token')
    @TokenType('access')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Validate Firebase ID token',
        description:
            'Validates access token from Authorization header and returns user information if the token is valid',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Token validation result',
        type: TokenValidationResponseDto,
        schema: {
            example: {
                success: true,
                message: 'Token is valid',
                data: {
                    uid: 'firebase-uid-123',
                    email: 'user@example.com',
                    name: 'John Doe',
                    picture: 'https://example.com/avatar.jpg',
                    emailVerified: true,
                    phoneNumber: '+1234567890',
                    provider: 'google.com',
                    userExists: true,
                    userId: '123e4567-e89b-12d3-a456-426614174000',
                    role: 'user',
                    issuedAt: '2024-01-01T00:00:00.000Z',
                    expiresAt: '2024-01-01T01:00:00.000Z',
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Invalid request data',
        schema: {
            example: {
                message: 'Validation failed',
                error: 'Bad Request',
                statusCode: 400,
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or missing Firebase token',
        schema: {
            example: {
                message: 'Authorization header is required',
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Invalid token',
        schema: {
            example: {
                success: false,
                message: 'Invalid Firebase token',
                data: null,
            },
        },
    })
    async validateToken(
        @ValidatedToken() accessToken: string,
    ): Promise<TokenValidationResponseDto> {
        try {
            this.logger.log('Access token validation request received');
            const result = await this.authService.validateToken(
                accessToken,
                'access',
            );
            this.logger.log(
                `Access token validation completed: ${result.success}`,
            );
            return {
                success: result.success,
                message: result.message,
                data: result.data,
            };
        } catch (error) {
            this.logger.error('Access token validation error:', error);

            return {
                success: false,
                message: error.message || 'Access token validation failed',
                data: null,
            };
        }
    }

    @Put('refresh-token')
    @TokenType('refresh')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Refresh access token using refresh token',
        description: 'Validates refresh token and generates a new access token',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Token refreshed successfully',
        type: SignInResponseDto,
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or expired refresh token',
        schema: {
            example: {
                message: 'refresh token is invalid or expired',
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        schema: {
            example: {
                message: 'User not found',
                error: 'Not Found',
                statusCode: 404,
            },
        },
    })
    async refreshToken(
        @ValidatedToken() refreshToken: string,
    ): Promise<SignInResponseDto> {
        try {
            this.logger.log('Refresh token request received');

            const validationResult = await this.authService.validateToken(
                refreshToken,
                'refresh',
            );
            if (!validationResult.success) {
                throw new HttpException(
                    {
                        message: validationResult.message,
                        error: 'Unauthorized',
                        statusCode: HttpStatus.UNAUTHORIZED,
                    },
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const user =
                await this.authService.getUserByRefreshToken(refreshToken);

            if (!user) {
                throw new HttpException(
                    {
                        message: 'User not found or refresh token mismatch',
                        error: 'Not Found',
                        statusCode: HttpStatus.NOT_FOUND,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const tokens = await this.authService.generateTokenPair(user);

            this.logger.log('Token refreshed successfully');
            return tokens;
        } catch (error) {
            this.logger.error('Token refresh failed:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: error.message || 'Token refresh failed',
                    error: 'Internal Server Error',
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
