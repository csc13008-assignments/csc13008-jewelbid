package jewelbid_dev.jewelbid.service;

import jewelbid_dev.jewelbid.entities.User;
import jewelbid_dev.jewelbid.enums.UserStatus;
import jewelbid_dev.jewelbid.exception.BadRequestException;
import jewelbid_dev.jewelbid.exception.ResourceNotFoundException;
import jewelbid_dev.jewelbid.payload.request.UserRegistrationRequest;
import jewelbid_dev.jewelbid.payload.response.UserResponse;
import jewelbid_dev.jewelbid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public User createUser(UserRegistrationRequest request) {
        if (existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .status(UserStatus.PENDING_VERIFICATION)
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);
        
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName());
        } catch (Exception e) {
            log.warn("Failed to send welcome email to: {}", savedUser.getEmail());
        }

        return savedUser;
    }

    public boolean validatePassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    @Transactional
    public void changePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        try {
            emailService.sendPasswordChangeNotification(user.getEmail(), user.getFullName());
        } catch (Exception e) {
            log.warn("Failed to send password change notification to: {}", user.getEmail());
        }
    }

    @Transactional
    public void updateRefreshToken(User user, String refreshToken, LocalDateTime expiry) {
        user.setRefreshToken(refreshToken, expiry);
        userRepository.save(user);
    }

    @Transactional
    public void clearRefreshToken(User user) {
        user.clearRefreshToken();
        userRepository.save(user);
    }

    public Optional<User> findByValidRefreshToken(String refreshToken) {
        return userRepository.findByValidRefreshToken(refreshToken, LocalDateTime.now());
    }

    @Transactional
    public void setOtp(User user, String otp, LocalDateTime expiry) {
        user.setOtp(otp, expiry);
        userRepository.save(user);
    }

    @Transactional
    public void clearOtp(User user) {
        user.clearOtp();
        userRepository.save(user);
    }

    public Optional<User> findByEmailAndValidOtp(String email, String otp) {
        return userRepository.findByEmailAndValidOtp(email, otp, LocalDateTime.now());
    }

    @Transactional
    public void handleFailedLogin(User user) {
        user.incrementFailedLoginAttempts();
        
        if (user.getFailedLoginAttempts() >= 5) {
            user.lockAccount(30);
            log.warn("Account locked for user: {} due to too many failed login attempts", user.getEmail());
        }
        
        userRepository.save(user);
    }

    @Transactional
    public void handleSuccessfulLogin(User user) {
        if (user.getFailedLoginAttempts() > 0) {
            user.resetFailedLoginAttempts();
            userRepository.save(user);
        }
    }

    @Transactional
    public void unlockAccount(User user) {
        user.unlockAccount();
        userRepository.save(user);
    }

    @Transactional
    public void verifyEmail(User user) {
        user.setEmailVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        user.clearOtp();
        userRepository.save(user);
    }

    public UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.getEmailVerified())
                .positiveRatings(user.getPositiveRatings())
                .negativeRatings(user.getNegativeRatings())
                .totalRatings(user.getTotalRatings())
                .positiveRatingPercentage(user.getPositiveRatingPercentage())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
