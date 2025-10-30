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

/**
 * Entity đại diện cho sản phẩm đấu giá
 */
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
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;
    
    @Column(columnDefinition = "TEXT")
    @NotBlank(message = "Mô tả sản phẩm không được để trống")
    private String description;
    
    @Column(name = "starting_price", nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Giá khởi điểm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá khởi điểm phải lớn hơn 0")
    private BigDecimal startingPrice;
    
    @Column(name = "current_price", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentPrice = BigDecimal.ZERO;
    
    @Column(name = "bid_increment", nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Bước giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bước giá phải lớn hơn 0")
    private BigDecimal bidIncrement;
    
    @Column(name = "buy_now_price", precision = 15, scale = 2)
    private BigDecimal buyNowPrice;
    
    @Column(name = "start_time", nullable = false)
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime startTime;
    
    @Column(name = "end_time", nullable = false)
    @NotNull(message = "Thời gian kết thúc không được để trống")
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
    
    // Seller information
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    @NotNull(message = "Người bán không được để trống")
    private User seller;
    
    // Category information
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Danh mục không được để trống")
    private Category category;
    
    // Current highest bidder
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "highest_bidder_id")
    private User highestBidder;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Bid> bids;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductQuestion> questions;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WatchList> watchLists;
    
    /**
     * Kiểm tra xem sản phẩm có đang trong thời gian đấu giá không
     * @return true nếu đang trong thời gian đấu giá
     */
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return status == ProductStatus.ACTIVE && 
               now.isAfter(startTime) && 
               now.isBefore(endTime);
    }
    
    /**
     * Kiểm tra xem sản phẩm có đã kết thúc không
     * @return true nếu đã kết thúc
     */
    public boolean isEnded() {
        return status == ProductStatus.ENDED || 
               LocalDateTime.now().isAfter(endTime);
    }
    
    /**
     * Kiểm tra xem sản phẩm có mới đăng không (trong vòng N phút)
     * @param minutes số phút để coi là mới
     * @return true nếu sản phẩm mới đăng
     */
    public boolean isNewlyPosted(int minutes) {
        return createdAt.isAfter(LocalDateTime.now().minusMinutes(minutes));
    }
    
    /**
     * Tính thời gian còn lại của đấu giá
     * @return số phút còn lại, -1 nếu đã kết thúc
     */
    public long getMinutesRemaining() {
        if (isEnded()) {
            return -1;
        }
        LocalDateTime now = LocalDateTime.now();
        return java.time.Duration.between(now, endTime).toMinutes();
    }
    
    /**
     * Kiểm tra xem có cần tự động gia hạn không
     * @return true nếu cần gia hạn
     */
    public boolean shouldAutoExtend() {
        if (!autoExtend || isEnded()) {
            return false;
        }
        return getMinutesRemaining() <= extendThresholdMinutes;
    }
    
    /**
     * Tự động gia hạn thời gian đấu giá
     */
    public void extendAuction() {
        if (shouldAutoExtend()) {
            this.endTime = this.endTime.plusMinutes(extendDurationMinutes);
        }
    }
    
    /**
     * Cập nhật giá hiện tại và người đấu giá cao nhất
     * @param newPrice giá mới
     * @param newBidder người đấu giá mới
     */
    public void updateCurrentBid(BigDecimal newPrice, User newBidder) {
        this.currentPrice = newPrice;
        this.highestBidder = newBidder;
        this.bidCount++;
        
        // Tự động gia hạn nếu cần
        extendAuction();
    }
    
    /**
     * Tăng số lượt xem
     */
    public void incrementViewCount() {
        this.viewCount++;
    }
    
    /**
     * Kiểm tra xem có giá mua ngay không
     * @return true nếu có giá mua ngay
     */
    public boolean hasBuyNowPrice() {
        return buyNowPrice != null && buyNowPrice.compareTo(BigDecimal.ZERO) > 0;
    }
    
    /**
     * Lấy giá tối thiểu cho lần đấu giá tiếp theo
     * @return giá tối thiểu
     */
    public BigDecimal getMinimumNextBid() {
        if (currentPrice.compareTo(BigDecimal.ZERO) == 0) {
            return startingPrice;
        }
        return currentPrice.add(bidIncrement);
    }
}
