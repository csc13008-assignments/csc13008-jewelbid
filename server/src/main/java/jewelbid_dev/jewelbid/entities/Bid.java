package jewelbid_dev.jewelbid.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jewelbid_dev.jewelbid.enums.BidType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho lượt đấu giá
 */
@Entity
@Table(name = "bids")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "bid_amount", nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Số tiền đấu giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền đấu giá phải lớn hơn 0")
    private BigDecimal bidAmount;
    
    @Column(name = "max_bid_amount", precision = 15, scale = 2)
    private BigDecimal maxBidAmount; // Cho automatic bidding
    
    @Enumerated(EnumType.STRING)
    @Column(name = "bid_type", nullable = false)
    @Builder.Default
    private BidType bidType = BidType.MANUAL;
    
    @Column(name = "is_winning")
    @Builder.Default
    private Boolean isWinning = false;
    
    @Column(name = "is_rejected")
    @Builder.Default
    private Boolean isRejected = false;
    
    @Column(name = "rejection_reason")
    private String rejectionReason;
    
    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;
    
    // Bidder information
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    @NotNull(message = "Người đấu giá không được để trống")
    private User bidder;
    
    // Product information
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Sản phẩm không được để trống")
    private Product product;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * Kiểm tra xem có phải là đấu giá tự động không
     * @return true nếu là đấu giá tự động
     */
    public boolean isAutomaticBid() {
        return bidType == BidType.AUTOMATIC;
    }
    
    /**
     * Kiểm tra xem có phải là đấu giá thủ công không
     * @return true nếu là đấu giá thủ công
     */
    public boolean isManualBid() {
        return bidType == BidType.MANUAL;
    }
    
    /**
     * Kiểm tra xem bid có hợp lệ không
     * @return true nếu bid hợp lệ (chưa bị từ chối)
     */
    public boolean isValid() {
        return !isRejected;
    }
    
    /**
     * Từ chối bid
     * @param reason lý do từ chối
     */
    public void reject(String reason) {
        this.isRejected = true;
        this.rejectionReason = reason;
        this.rejectedAt = LocalDateTime.now();
        this.isWinning = false;
    }
    
    /**
     * Đánh dấu bid là winning bid
     */
    public void markAsWinning() {
        if (!isRejected) {
            this.isWinning = true;
        }
    }
    
    /**
     * Bỏ đánh dấu winning bid
     */
    public void unmarkAsWinning() {
        this.isWinning = false;
    }
    
    /**
     * Kiểm tra xem bid có thể tự động tăng giá không
     * @param competingBidAmount giá của bid cạnh tranh
     * @return true nếu có thể tự động tăng giá
     */
    public boolean canAutoBid(BigDecimal competingBidAmount) {
        if (!isAutomaticBid() || isRejected) {
            return false;
        }
        
        if (maxBidAmount == null) {
            return false;
        }
        
        // Kiểm tra xem maxBidAmount có đủ để đấu giá cao hơn không
        BigDecimal nextBidAmount = competingBidAmount.add(product.getBidIncrement());
        return maxBidAmount.compareTo(nextBidAmount) >= 0;
    }
    
    /**
     * Tính toán bid amount tiếp theo cho automatic bidding
     * @param competingBidAmount giá của bid cạnh tranh
     * @return bid amount tiếp theo
     */
    public BigDecimal calculateNextAutoBidAmount(BigDecimal competingBidAmount) {
        if (!canAutoBid(competingBidAmount)) {
            return null;
        }
        
        BigDecimal nextBidAmount = competingBidAmount.add(product.getBidIncrement());
        
        // Không vượt quá maxBidAmount
        if (nextBidAmount.compareTo(maxBidAmount) > 0) {
            return maxBidAmount;
        }
        
        return nextBidAmount;
    }
    
    /**
     * Cập nhật bid amount cho automatic bidding
     * @param newAmount bid amount mới
     */
    public void updateBidAmount(BigDecimal newAmount) {
        if (isAutomaticBid() && !isRejected) {
            this.bidAmount = newAmount;
        }
    }
}
