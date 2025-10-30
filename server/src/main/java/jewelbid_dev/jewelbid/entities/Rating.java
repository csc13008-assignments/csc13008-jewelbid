package jewelbid_dev.jewelbid.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jewelbid_dev.jewelbid.enums.RatingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho đánh giá người dùng
 */
@Entity
@Table(name = "ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "rating_type", nullable = false)
    @NotNull(message = "Loại đánh giá không được để trống")
    private RatingType ratingType;
    
    @Column(columnDefinition = "TEXT")
    @Size(max = 500, message = "Nhận xét không được vượt quá 500 ký tự")
    private String comment;
    
    // Người được đánh giá
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rated_user_id", nullable = false)
    @NotNull(message = "Người được đánh giá không được để trống")
    private User ratedUser;
    
    // Người đánh giá
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rating_user_id", nullable = false)
    @NotNull(message = "Người đánh giá không được để trống")
    private User ratingUser;
    
    // Sản phẩm liên quan (nếu có)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Kiểm tra xem có phải là đánh giá tích cực không
     * @return true nếu là đánh giá tích cực
     */
    public boolean isPositive() {
        return ratingType == RatingType.POSITIVE;
    }
    
    /**
     * Kiểm tra xem có phải là đánh giá tiêu cực không
     * @return true nếu là đánh giá tiêu cực
     */
    public boolean isNegative() {
        return ratingType == RatingType.NEGATIVE;
    }
}
