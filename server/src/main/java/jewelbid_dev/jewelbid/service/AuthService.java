package jewelbid_dev.jewelbid.service;

import jewelbid_dev.jewelbid.entities.User;
import jewelbid_dev.jewelbid.enums.UserStatus;
import jewelbid_dev.jewelbid.exception.AccountLockedException;
import jewelbid_dev.jewelbid.exception.AuthenticationException;
import jewelbid_dev.jewelbid.exception.BadRequestException;
import jewelbid_dev.jewelbid.exception.TokenValidationException;
import jewelbid_dev.jewelbid.payload.request.*;
import jewelbid_dev.jewelbid.payload.response.AuthResponse;
import jewelbid_dev.jewelbid.payload.response.MessageResponse;
import jewelbid_dev.jewelbid.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTokenService redisTokenService;
    private final EmailService emailService;

    @Value("${jewelbid.otp.expiration-minutes}")
    private int otpExpirationMinutes;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userService.getUserByEmail(request.getEmail());

        if (user.isAccountLocked()) {
            throw new AccountLockedException("Account is temporarily locked due to too many failed login attempts");
        }

        if (!userService.validatePassword(user, request.getPassword())) {
            userService.handleFailedLogin(user);
            throw new AuthenticationException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.PENDING_VERIFICATION) {
            throw new AuthenticationException("Please verify your email before logging in");
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new AuthenticationException("Account is inactive");
        }

        userService.handleSuccessfulLogin(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        redisTokenService.whitelistToken(accessToken, user.getId());
        
        userService.updateRefreshToken(user, refreshToken, jwtTokenProvider.getRefreshTokenExpiration());

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userService.convertToUserResponse(user))
                .build();
    }

    @Transactional
    public MessageResponse register(UserRegistrationRequest request) {
        User user = userService.createUser(request);
        
        String otp = emailService.generateOtp();
        redisTokenService.storeOtp(user.getEmail(), otp);
        
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            log.error("Failed to send OTP email during registration", e);
            throw new BadRequestException("Failed to send verification email");
        }

        log.info("User registered successfully: {}", user.getEmail());
        return MessageResponse.success("Registration successful. Please check your email for verification code.");
    }

    @Transactional
    public MessageResponse verifyOtp(VerifyOtpRequest request) {
        if (!redisTokenService.validateOtp(request.getEmail(), request.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userService.getUserByEmail(request.getEmail());
        userService.verifyEmail(user);
        redisTokenService.removeOtp(request.getEmail());

        log.info("Email verified successfully: {}", user.getEmail());
        return MessageResponse.success("Email verified successfully. You can now login.");
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtTokenProvider.validateRefreshToken(request.getRefreshToken())) {
            throw new TokenValidationException("Invalid refresh token");
        }

        User user = userService.findByValidRefreshToken(request.getRefreshToken())
                .orElseThrow(() -> new TokenValidationException("Invalid or expired refresh token"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        redisTokenService.whitelistToken(newAccessToken, user.getId());
        userService.updateRefreshToken(user, newRefreshToken, jwtTokenProvider.getRefreshTokenExpiration());

        log.info("Token refreshed successfully for user: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(userService.convertToUserResponse(user))
                .build();
    }

    @Transactional
    public MessageResponse changePassword(Long userId, ChangePasswordRequest request) {
        User user = userService.getUserById(userId);

        if (!userService.validatePassword(user, request.getCurrentPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        userService.changePassword(user, request.getNewPassword());
        redisTokenService.removeAllUserTokens(userId);

        log.info("Password changed successfully for user: {}", user.getEmail());
        return MessageResponse.success("Password changed successfully. Please login again.");
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No account found with this email"));

        String otp = emailService.generateOtp();
        redisTokenService.storeOtp(user.getEmail(), otp);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            log.error("Failed to send OTP email for password reset", e);
            throw new BadRequestException("Failed to send reset email");
        }

        log.info("Password reset OTP sent to: {}", user.getEmail());
        return MessageResponse.success("Password reset code sent to your email.");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        if (!redisTokenService.validateOtp(request.getEmail(), request.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userService.getUserByEmail(request.getEmail());
        userService.changePassword(user, request.getPassword());
        redisTokenService.removeOtp(request.getEmail());
        redisTokenService.removeAllUserTokens(user.getId());

        log.info("Password reset successfully for user: {}", user.getEmail());
        return MessageResponse.success("Password reset successfully. Please login with your new password.");
    }

    @Transactional
    public MessageResponse logout(String accessToken, Long userId) {
        redisTokenService.blacklistToken(accessToken);
        
        User user = userService.getUserById(userId);
        userService.clearRefreshToken(user);

        log.info("User logged out successfully: {}", user.getEmail());
        return MessageResponse.success("Logged out successfully");
    }
}
