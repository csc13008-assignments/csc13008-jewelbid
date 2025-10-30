package jewelbid_dev.jewelbid.payload.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jewelbid_dev.jewelbid.enums.BidType;
import jewelbid_dev.jewelbid.validation.ValidBidAmount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ValidBidAmount
public class PlaceBidRequest {
    
    @NotNull(message = "Bid amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bid amount must be greater than 0")
    private BigDecimal bidAmount;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum bid amount must be greater than 0")
    private BigDecimal maxBidAmount;
    
    @NotNull(message = "Bid type is required")
    private BidType bidType;
}
