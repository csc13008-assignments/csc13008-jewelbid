package jewelbid_dev.jewelbid.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jewelbid_dev.jewelbid.enums.UserRole;
import jewelbid_dev.jewelbid.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @Column(name = "full_name", nullable = false)
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserRole role = UserRole.BIDDER;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.PENDING_VERIFICATION;
    
    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;
    
    
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;
    
    @Column(name = "refresh_token_expiry")
    private LocalDateTime refreshTokenExpiry;
    
    @Column(name = "failed_login_attempts")
    @Builder.Default
    private Integer failedLoginAttempts = 0;
    
    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;
    
    // Rating system fields
    @Column(name = "positive_ratings")
    @Builder.Default
    private Integer positiveRatings = 0;
    
    @Column(name = "negative_ratings")
    @Builder.Default
    private Integer negativeRatings = 0;
    
    @Column(name = "total_ratings")
    @Builder.Default
    private Integer totalRatings = 0;
    
    // Upgrade request tracking
    @Column(name = "upgrade_requested")
    @Builder.Default
    private Boolean upgradeRequested = false;
    
    @Column(name = "upgrade_request_date")
    private LocalDateTime upgradeRequestDate;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> productsForSale;
    
    @OneToMany(mappedBy = "bidder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Bid> bids;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WatchList> watchLists;
    
    @OneToMany(mappedBy = "ratedUser", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Rating> receivedRatings;
    
    @OneToMany(mappedBy = "ratingUser", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Rating> givenRatings;
    
    @OneToMany(mappedBy = "questioner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductQuestion> questions;
    
    public double getPositiveRatingPercentage() {
        if (totalRatings == 0) {
            return 0.0;
        }
        return (double) positiveRatings / totalRatings;
    }
    
    public boolean isEligibleForBidding() {
        if (totalRatings == 0) {
            return true;
        }
        return getPositiveRatingPercentage() >= 0.8;
    }
    
    public boolean canUpgradeToSeller() {
        return role == UserRole.BIDDER && 
               status == UserStatus.ACTIVE && 
               !upgradeRequested;
    }
    
    public boolean isAccountLocked() {
        return accountLockedUntil != null && LocalDateTime.now().isBefore(accountLockedUntil);
    }
    
    public void lockAccount(int lockDurationMinutes) {
        this.accountLockedUntil = LocalDateTime.now().plusMinutes(lockDurationMinutes);
    }
    
    public void unlockAccount() {
        this.accountLockedUntil = null;
        this.failedLoginAttempts = 0;
    }
    
    public void incrementFailedLoginAttempts() {
        this.failedLoginAttempts++;
    }
    
    public void resetFailedLoginAttempts() {
        this.failedLoginAttempts = 0;
    }
    
    public boolean isRefreshTokenValid() {
        return refreshToken != null && 
               refreshTokenExpiry != null && 
               LocalDateTime.now().isBefore(refreshTokenExpiry);
    }
    
    public void setRefreshToken(String refreshToken, LocalDateTime expiry) {
        this.refreshToken = refreshToken;
        this.refreshTokenExpiry = expiry;
    }
    
    public void clearRefreshToken() {
        this.refreshToken = null;
        this.refreshTokenExpiry = null;
    }
    
}
