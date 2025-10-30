package jewelbid_dev.jewelbid.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jewelbid_dev.jewelbid.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Product name is required")
    private String name;
    
    @Column(columnDefinition = "TEXT")
    @NotBlank(message = "Product description is required")
    private String description;
    
    @Column(name = "starting_price", nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Starting price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Starting price must be greater than 0")
    private BigDecimal startingPrice;
    
    @Column(name = "current_price", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentPrice = BigDecimal.ZERO;
    
    @Column(name = "bid_increment", nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Bid increment is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bid increment must be greater than 0")
    private BigDecimal bidIncrement;
    
    @Column(name = "buy_now_price", precision = 15, scale = 2)
    private BigDecimal buyNowPrice;
    
    @Column(name = "start_time", nullable = false)
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
    
    @Column(name = "end_time", nullable = false)
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
    
    @Column(name = "auto_extend")
    @Builder.Default
    private Boolean autoExtend = false;
    
    @Column(name = "extend_duration_minutes")
    @Builder.Default
    private Integer extendDurationMinutes = 10;
    
    @Column(name = "extend_threshold_minutes")
    @Builder.Default
    private Integer extendThresholdMinutes = 5;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProductStatus status = ProductStatus.DRAFT;
    
    @Column(name = "bid_count")
    @Builder.Default
    private Integer bidCount = 0;
    
    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;
    
    @Column(name = "main_image_url")
    private String mainImageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    @NotNull(message = "Seller is required")
    private User seller;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Category is required")
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "highest_bidder_id")
    private User highestBidder;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Bid> bids;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductQuestion> questions;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WatchList> watchLists;
    
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return status == ProductStatus.ACTIVE && 
               now.isAfter(startTime) && 
               now.isBefore(endTime);
    }
    
    public boolean isEnded() {
        return status == ProductStatus.ENDED || 
               LocalDateTime.now().isAfter(endTime);
    }
    
    public boolean isNewlyPosted(int minutes) {
        return createdAt.isAfter(LocalDateTime.now().minusMinutes(minutes));
    }
    
    public long getMinutesRemaining() {
        if (isEnded()) {
            return -1;
        }
        LocalDateTime now = LocalDateTime.now();
        return java.time.Duration.between(now, endTime).toMinutes();
    }
    
    public boolean shouldAutoExtend() {
        if (!autoExtend || isEnded()) {
            return false;
        }
        return getMinutesRemaining() <= extendThresholdMinutes;
    }
    
    public void extendAuction() {
        if (shouldAutoExtend()) {
            this.endTime = this.endTime.plusMinutes(extendDurationMinutes);
        }
    }
    
    public void updateCurrentBid(BigDecimal newPrice, User newBidder) {
        this.currentPrice = newPrice;
        this.highestBidder = newBidder;
        this.bidCount++;
        
        extendAuction();
    }
    
    public void incrementViewCount() {
        this.viewCount++;
    }
    
    public boolean hasBuyNowPrice() {
        return buyNowPrice != null && buyNowPrice.compareTo(BigDecimal.ZERO) > 0;
    }
    
    public BigDecimal getMinimumNextBid() {
        if (currentPrice.compareTo(BigDecimal.ZERO) == 0) {
            return startingPrice;
        }
        return currentPrice.add(bidIncrement);
    }
}
