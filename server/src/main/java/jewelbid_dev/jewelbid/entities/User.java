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

/**
 * Entity đại diện cho người dùng trong hệ thống đấu giá
 */
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
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;
    
    @Column(nullable = false)
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
    
    @Column(name = "full_name", nullable = false)
    @NotBlank(message = "Họ tên không được để trống")
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
    
    @Column(name = "otp_code")
    private String otpCode;
    
    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;
    
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
    
    /**
     * Tính toán tỷ lệ đánh giá tích cực
     * @return tỷ lệ đánh giá tích cực (0.0 - 1.0)
     */
    public double getPositiveRatingPercentage() {
        if (totalRatings == 0) {
            return 0.0;
        }
        return (double) positiveRatings / totalRatings;
    }
    
    /**
     * Kiểm tra xem người dùng có đủ điều kiện đấu giá không
     * @return true nếu tỷ lệ đánh giá tích cực >= 80% hoặc chưa có đánh giá nào
     */
    public boolean isEligibleForBidding() {
        if (totalRatings == 0) {
            return true; // Người dùng mới được phép đấu giá
        }
        return getPositiveRatingPercentage() >= 0.8;
    }
    
    /**
     * Kiểm tra xem có thể nâng cấp lên seller không
     * @return true nếu có thể nâng cấp
     */
    public boolean canUpgradeToSeller() {
        return role == UserRole.BIDDER && 
               status == UserStatus.ACTIVE && 
               !upgradeRequested;
    }
}
