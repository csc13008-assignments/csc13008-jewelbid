package jewelbid_dev.jewelbid.payload.response;

import jewelbid_dev.jewelbid.enums.BidType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO cho response thông tin đấu giá
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BidResponse {
    
    private Long id;
    private BigDecimal bidAmount;
    private BidType bidType;
    private Boolean isWinning;
    private Boolean isRejected;
    private String rejectionReason;
    
    // Masked bidder name for public view
    private String bidderName;
    
    // Full bidder info for owner/admin view
    private UserResponse bidder;
    
    private LocalDateTime createdAt;
    private LocalDateTime rejectedAt;
}
