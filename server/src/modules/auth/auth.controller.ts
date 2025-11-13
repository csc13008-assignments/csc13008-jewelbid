import {
    Body,
    Controller,
    HttpCode,
    Post,
    UseGuards,
    Request,
    Res,
    Delete,
    Put,
    Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ATAuthGuard } from './guards/at-auth.guard';
import { RTAuthGuard } from './guards/rt-auth.guard';
import {
    ApiResponse,
    ApiOperation,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { TokensDto } from './dtos/tokens.dto';
import { AuthLoginDto } from './dtos/user-signin.dto';
import { UserSignUpDto } from './dtos/user-signup.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { ResendVerificationDto } from './dtos/resend-verification.dto';
import {
    ChangePasswordDto,
    ForgotPasswordDto,
    ResetPasswordDto,
} from './dtos/auth-psw-recovery.dto';
import { UserLoginDto } from './dtos/user-signin.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'Login using email and password',
    })
    @ApiBody({ type: AuthLoginDto })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: TokensDto,
    })
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('sign-in')
    async signIn(@Request() req: any, @Res() res: Response): Promise<void> {
        const { refreshToken, accessToken } = await this.authService.signIn(
            req.user as UserLoginDto,
        );
        res.cookie('refresh_token', refreshToken, { httpOnly: true });
        res.send({
            accessToken,
            refreshToken,
            message: 'User has been signed in successfully',
        });
    }

    @ApiOperation({ summary: 'Sign-up to register account' })
    @ApiBody({ type: UserSignUpDto })
    @ApiResponse({
        status: 200,
        description: 'Sign-up successful, verification email sent',
    })
    @Post('sign-up')
    @HttpCode(200)
    async signUp(
        @Body() req: UserSignUpDto,
        @Res() res: Response,
    ): Promise<void> {
        const result = await this.authService.signUp(req);
        res.send(result);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Sign-out and clear credentials' })
    @ApiResponse({
        status: 200,
        description: 'Sign-out successful',
    })
    @Delete('sign-out')
    @UseGuards(ATAuthGuard)
    @HttpCode(200)
    async signOut(@Request() req: any, @Res() res: Response): Promise<void> {
        await this.authService.signOut(req.user);
        res.clearCookie('refresh_token');
        res.send({
            message: 'User has been signed out successfully',
        });
    }

    @ApiBearerAuth('refresh-token')
    @ApiOperation({
        summary:
            'Refresh tokens with credentials. Provide refresh token, not access token to the field',
    })
    @Put('refresh-token')
    @UseGuards(RTAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Refresh tokens successfully',
        type: TokensDto,
    })
    @HttpCode(200)
    async refreshToken(
        @Request() req: any,
        @Res() res: Response,
    ): Promise<void> {
        const oldRefreshToken = req
            .get('Authorization')
            .replace('Bearer', '')
            .trim();

        const { refreshToken, accessToken } =
            await this.authService.getNewTokens(oldRefreshToken);
        res.cookie('refresh_token', refreshToken, { httpOnly: true });

        res.send({
            accessToken,
            message: 'Access token has been refreshed successfully',
        });
    }

    @ApiOperation({ summary: 'Password recovery' })
    @Post('password-recovery')
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Send OTP successfully via email',
    })
    @HttpCode(200)
    async forgotPassword(
        @Request() req: any,
        @Res() res: Response,
    ): Promise<void> {
        await this.authService.forgotPassword(req.body.email);
        res.send({
            message: 'Password recovery email has been sent successfully',
        });
    }

    @ApiOperation({ summary: 'Change password' })
    @ApiBearerAuth('access-token')
    @Put('change-password')
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
    })
    @HttpCode(200)
    @UseGuards(ATAuthGuard)
    async changePassword(
        @Request() req: any,
        @Res() res: Response,
    ): Promise<void> {
        await this.authService.changePassword(
            req.user.id,
            req.body.oldPassword,
            req.body.newPassword,
            req.body.confirmPassword,
        );
        res.send({
            message: 'Password has been changed successfully',
        });
    }

    @ApiOperation({ summary: 'Reset password' })
    @Patch('reset-password')
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Reset password successfully',
    })
    @HttpCode(200)
    async resetPassword(
        @Request() req: any,
        @Res() res: Response,
    ): Promise<void> {
        const email = req.body.email;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        await this.authService.resetPassword(
            email,
            otp,
            newPassword,
            confirmPassword,
        );
        res.send({
            message: 'Password has been reset successfully',
        });
    }

    @ApiOperation({ summary: 'Verify email with OTP' })
    @Post('verify-email')
    @ApiBody({ type: VerifyEmailDto })
    @ApiResponse({
        status: 200,
        description: 'Email verified successfully',
    })
    @HttpCode(200)
    async verifyEmail(
        @Body() verifyEmailDto: VerifyEmailDto,
        @Res() res: Response,
    ): Promise<void> {
        const result = await this.authService.verifyEmail(verifyEmailDto);
        res.send(result);
    }

    @ApiOperation({ summary: 'Resend email verification OTP' })
    @Post('resend-verification')
    @ApiBody({ type: ResendVerificationDto })
    @ApiResponse({
        status: 200,
        description: 'Verification OTP resent successfully',
    })
    @HttpCode(200)
    async resendVerificationOtp(
        @Body() body: ResendVerificationDto,
        @Res() res: Response,
    ): Promise<void> {
        const result = await this.authService.resendVerificationOtp(body.email);
        res.send(result);
    }
}
