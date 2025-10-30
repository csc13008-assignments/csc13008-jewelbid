package jewelbid_dev.jewelbid.payload.response;

import jewelbid_dev.jewelbid.enums.BidType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    
    private String bidderName;
    
    private UserResponse bidder;
    
    private LocalDateTime createdAt;
    private LocalDateTime rejectedAt;
}
