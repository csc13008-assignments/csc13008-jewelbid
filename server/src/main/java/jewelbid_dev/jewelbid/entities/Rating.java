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
    @NotNull(message = "Rating type is required")
    private RatingType ratingType;
    
    @Column(columnDefinition = "TEXT")
    @Size(max = 500, message = "Comment must not exceed 500 characters")
    private String comment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rated_user_id", nullable = false)
    @NotNull(message = "Rated user is required")
    private User ratedUser;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rating_user_id", nullable = false)
    @NotNull(message = "Rating user is required")
    private User ratingUser;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public boolean isPositive() {
        return ratingType == RatingType.POSITIVE;
    }
    
    public boolean isNegative() {
        return ratingType == RatingType.NEGATIVE;
    }
}
