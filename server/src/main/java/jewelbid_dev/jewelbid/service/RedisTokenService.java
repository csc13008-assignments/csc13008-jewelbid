package jewelbid_dev.jewelbid.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisTokenService {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${jewelbid.jwt.access-token.expiration}")
    private long accessTokenExpiration;

    @Value("${jewelbid.otp.expiration-minutes}")
    private int otpExpirationMinutes;

    private static final String ACCESS_TOKEN_PREFIX = "access_token:";
    private static final String BLACKLIST_TOKEN_PREFIX = "blacklist_token:";
    private static final String OTP_PREFIX = "otp:";

    public void whitelistToken(String token, Long userId) {
        try {
            String key = ACCESS_TOKEN_PREFIX + token;
            redisTemplate.opsForValue().set(key, userId.toString(), 
                Duration.ofMillis(accessTokenExpiration));
            log.debug("Token whitelisted for user: {}", userId);
        } catch (Exception e) {
            log.error("Error whitelisting token: {}", e.getMessage());
        }
    }

    public boolean isTokenWhitelisted(String token) {
        try {
            String key = ACCESS_TOKEN_PREFIX + token;
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("Error checking token whitelist: {}", e.getMessage());
            return false;
        }
    }

    public void removeTokenFromWhitelist(String token) {
        try {
            String key = ACCESS_TOKEN_PREFIX + token;
            redisTemplate.delete(key);
            log.debug("Token removed from whitelist");
        } catch (Exception e) {
            log.error("Error removing token from whitelist: {}", e.getMessage());
        }
    }

    public void blacklistToken(String token) {
        try {
            String key = BLACKLIST_TOKEN_PREFIX + token;
            redisTemplate.opsForValue().set(key, "blacklisted", 
                Duration.ofMillis(accessTokenExpiration));
            
            removeTokenFromWhitelist(token);
            log.debug("Token blacklisted");
        } catch (Exception e) {
            log.error("Error blacklisting token: {}", e.getMessage());
        }
    }

    public boolean isTokenBlacklisted(String token) {
        try {
            String key = BLACKLIST_TOKEN_PREFIX + token;
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("Error checking token blacklist: {}", e.getMessage());
            return false;
        }
    }

    public void storeOtp(String email, String otp) {
        try {
            String key = OTP_PREFIX + email;
            redisTemplate.opsForValue().set(key, otp, 
                Duration.ofMinutes(otpExpirationMinutes));
            log.debug("OTP stored for email: {}", email);
        } catch (Exception e) {
            log.error("Error storing OTP: {}", e.getMessage());
        }
    }

    public String getOtp(String email) {
        try {
            String key = OTP_PREFIX + email;
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Error retrieving OTP: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateOtp(String email, String otp) {
        try {
            String storedOtp = getOtp(email);
            return storedOtp != null && storedOtp.equals(otp);
        } catch (Exception e) {
            log.error("Error validating OTP: {}", e.getMessage());
            return false;
        }
    }

    public void removeOtp(String email) {
        try {
            String key = OTP_PREFIX + email;
            redisTemplate.delete(key);
            log.debug("OTP removed for email: {}", email);
        } catch (Exception e) {
            log.error("Error removing OTP: {}", e.getMessage());
        }
    }

    public void removeAllUserTokens(Long userId) {
        try {
            String pattern = ACCESS_TOKEN_PREFIX + "*";
            redisTemplate.keys(pattern).forEach(key -> {
                String storedUserId = redisTemplate.opsForValue().get(key);
                if (userId.toString().equals(storedUserId)) {
                    redisTemplate.delete(key);
                }
            });
            log.debug("All tokens removed for user: {}", userId);
        } catch (Exception e) {
            log.error("Error removing user tokens: {}", e.getMessage());
        }
    }
}
