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
    @NotNull(message = "Bid amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bid amount must be greater than 0")
    private BigDecimal bidAmount;
    
    @Column(name = "max_bid_amount", precision = 15, scale = 2)
    private BigDecimal maxBidAmount;
    
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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    @NotNull(message = "Bidder is required")
    private User bidder;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public boolean isAutomaticBid() {
        return bidType == BidType.AUTOMATIC;
    }
    
    public boolean isManualBid() {
        return bidType == BidType.MANUAL;
    }
    
    public boolean isValid() {
        return !isRejected;
    }
    
    public void reject(String reason) {
        this.isRejected = true;
        this.rejectionReason = reason;
        this.rejectedAt = LocalDateTime.now();
        this.isWinning = false;
    }
    
    public void markAsWinning() {
        if (!isRejected) {
            this.isWinning = true;
        }
    }
    
    public void unmarkAsWinning() {
        this.isWinning = false;
    }
    
    public boolean canAutoBid(BigDecimal competingBidAmount) {
        if (!isAutomaticBid() || isRejected) {
            return false;
        }
        
        if (maxBidAmount == null) {
            return false;
        }
        
        BigDecimal nextBidAmount = competingBidAmount.add(product.getBidIncrement());
        return maxBidAmount.compareTo(nextBidAmount) >= 0;
    }
    
    public BigDecimal calculateNextAutoBidAmount(BigDecimal competingBidAmount) {
        if (!canAutoBid(competingBidAmount)) {
            return null;
        }
        
        BigDecimal nextBidAmount = competingBidAmount.add(product.getBidIncrement());
        
        if (nextBidAmount.compareTo(maxBidAmount) > 0) {
            return maxBidAmount;
        }
        
        return nextBidAmount;
    }
    
    public void updateBidAmount(BigDecimal newAmount) {
        if (isAutomaticBid() && !isRejected) {
            this.bidAmount = newAmount;
        }
    }
}
